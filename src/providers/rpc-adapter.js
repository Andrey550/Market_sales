import { findCategoryById, flattenParentCategories } from '../catalog-utils.js';
import { httpPostJson } from '../utils/http.js';
import { logError } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';
import { normalizeEcomProduct } from './normalize.js';

const CATEGORIES_TIMEOUT_MS = 5000;
const PRODUCTS_TIMEOUT_MS = 8000;
const CATEGORY_RETRY_BASE_MS = 200;
const MAX_PAGES = 10;
const PAGE_CONCURRENCY = 3;
const PRODUCTS_TOTAL_TIMEOUT_MS = 20000;

function requireEnvString(env, key, storeName) {
  const value = env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env var ${key} for ${storeName}`);
  }
  return String(value);
}

function requireEnvNumber(env, key, storeName) {
  const raw = env[key];
  if (raw === undefined || raw === null || raw === '') {
    throw new Error(`Missing or invalid env var ${key} for ${storeName} (expected number, got ${JSON.stringify(raw)})`);
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Missing or invalid env var ${key} for ${storeName} (expected number, got ${JSON.stringify(raw)})`);
  }
  return value;
}

export function createRpcAdapter(config) {
  const {
    baseUrl,
    extraHeaders = {},
    filialIdKey,
    merchantIdKey = null,
    deliveryTypeKey,
    deliveryTypeIsString = true,
    pageSize,
    storeName,
    productUrlBase,
  } = config;

  const baseHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0',
    ...extraHeaders,
  };

  async function callApi(method, data, timeoutMs) {
    return httpPostJson(baseUrl, { method, data }, { headers: baseHeaders, timeoutMs });
  }

  async function callApiLogged(method, data, timeoutMs, maxRetries) {
    try {
      return await withRetry(
        () => callApi(method, data, timeoutMs),
        maxRetries,
        CATEGORY_RETRY_BASE_MS
      );
    } catch (err) {
      logError('api_request_failed', err, { store: storeName, method });
      throw err;
    }
  }

  function readConfig(env = {}) {
    const filialId = requireEnvNumber(env, filialIdKey, storeName);
    const deliveryType = deliveryTypeIsString
      ? requireEnvString(env, deliveryTypeKey, storeName)
      : requireEnvNumber(env, deliveryTypeKey, storeName);
    const merchantId = merchantIdKey ? requireEnvNumber(env, merchantIdKey, storeName) : null;
    return { filialId, merchantId, deliveryType };
  }

  async function getCategoryTree(env = {}) {
    const { filialId, merchantId, deliveryType } = readConfig(env);
    const data = merchantId !== null
      ? { filialId, merchantId, deliveryType }
      : { filialId, deliveryType };

    const result = await callApiLogged('GetCategories', data, CATEGORIES_TIMEOUT_MS, 2);
    return Array.isArray(result?.tree) ? result.tree : [];
  }

  async function getCategories(env = {}) {
    const tree = await getCategoryTree(env);
    return flattenParentCategories(tree);
  }

  async function getProducts(categoryId, env = {}, categoriesTree = null) {
    const { filialId, merchantId, deliveryType } = readConfig(env);

    let categoryName = '';
    if (categoryId) {
      try {
        const tree = categoriesTree ?? await getCategoryTree(env);
        const category = findCategoryById(tree, categoryId);
        if (category?.name) {
          categoryName = category.name;
        }
      } catch (err) {
        logError('category_lookup_failed', err, { store: storeName, categoryId });
      }
    }

    // Build all page requests up front so we can fetch them with bounded
    // concurrency instead of sequentially (a 5000-item category with 50
    // sequential pages could exceed the Worker wall-time budget).
    const pageRequests = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const offset = page * pageSize;
      const data = {
        filialId,
        ...(merchantId !== null && { merchantId }),
        deliveryType,
        From: offset + 1,
        To: offset + pageSize,
        RankedResultsOnly: false,
      };

      if (categoryId) {
        data.categoryId = Number.parseInt(categoryId, 10) || 0;
      }

      pageRequests.push(data);
    }

    const deadline = Date.now() + PRODUCTS_TOTAL_TIMEOUT_MS;
    const pages = [];

    async function runWithConcurrency(tasks, limit) {
      const results = new Array(tasks.length);
      let cursor = 0;
      const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
        while (true) {
          if (Date.now() >= deadline) {
            return;
          }
          const idx = cursor++;
          if (idx >= tasks.length) return;
          try {
            results[idx] = await callApiLogged('GetSimpleCatalogItems', tasks[idx], PRODUCTS_TIMEOUT_MS, 0);
          } catch (err) {
            logError('api_request_failed', err, { store: storeName, method: 'GetSimpleCatalogItems', page: idx });
            results[idx] = { __error: true };
          }
        }
      });
      await Promise.all(workers);
      return results;
    }

    const settled = await runWithConcurrency(pageRequests, PAGE_CONCURRENCY);

    let total = null;
    for (let i = 0; i < settled.length; i++) {
      if (Date.now() >= deadline) {
        logError('products_budget_exceeded', new Error('wall-time budget exceeded'), {
          store: storeName,
          categoryId,
          pagesProcessed: i,
        });
        break;
      }
      const payload = settled[i];
      if (!payload || payload.__error) continue;
      const items = Array.isArray(payload?.items) ? payload.items : [];

      if (total === null) {
        total = payload?.itemsCount ?? items.length;
      }

      for (const item of items) {
        pages.push(normalizeEcomProduct(item, { storeName, productUrlBase, categoryName }));
      }

      if (items.length < pageSize || pages.length >= total) {
        break;
      }
    }

    return {
      total: pages.length,
      products: pages,
    };
  }

  return { getCategoryTree, getCategories, getProducts };
}
