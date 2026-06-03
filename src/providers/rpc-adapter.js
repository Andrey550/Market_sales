import { findCategoryById, flattenParentCategories } from '../catalog-utils.js';
import { fetchWithTimeout } from '../utils/fetch.js';
import { logError } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';

const CATEGORIES_TIMEOUT_MS = 5000;
const PRODUCTS_TIMEOUT_MS = 8000;
const CATEGORY_RETRY_BASE_MS = 200;

export function createRpcAdapter(config) {
  const {
    baseUrl,
    extraHeaders = {},
    filialIdKey,
    merchantIdKey = null,
    deliveryTypeKey,
    defaultFilialId,
    defaultMerchantId = null,
    defaultDeliveryType,
    pageSize,
    storeName,
    normalizeProduct,
  } = config;

  const baseHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0',
    ...extraHeaders,
  };

  async function callApi(method, data, timeoutMs) {
    const resp = await fetchWithTimeout(baseUrl, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({ method, data }),
    }, timeoutMs);

    if (!resp.ok) {
      const text = await resp.text();
      const err = new Error(`${storeName} API error: ${resp.status} - ${text.substring(0, 200)}`);
      err.status = resp.status;
      throw err;
    }

    return resp.json();
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
    const filialId = Number(env[filialIdKey]) || defaultFilialId;
    const deliveryType = typeof defaultDeliveryType === 'string'
      ? (env[deliveryTypeKey] || defaultDeliveryType)
      : (Number(env[deliveryTypeKey]) || defaultDeliveryType);
    const merchantId = merchantIdKey
      ? (Number(env[merchantIdKey]) || defaultMerchantId)
      : null;
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

    const allProducts = [];
    let offset = 0;
    let total = null;

    while (true) {
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

      const payload = await callApiLogged('GetSimpleCatalogItems', data, PRODUCTS_TIMEOUT_MS, 0);
      const items = Array.isArray(payload?.items) ? payload.items : [];

      if (total === null) {
        total = payload?.itemsCount ?? items.length;
      }

      for (const item of items) {
        allProducts.push(normalizeProduct(item, categoryName));
      }

      offset += pageSize;
      if (items.length < pageSize || allProducts.length >= total) {
        break;
      }
    }

    return {
      total: allProducts.length,
      products: allProducts,
    };
  }

  return { getCategoryTree, getCategories, getProducts };
}
