import { findCategoryById, flattenNestedCategories } from '../catalog-utils.js';
import { httpGetJson } from '../utils/http.js';
import { logError } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';

const ZAKAZ_BASE = 'https://stores-api.zakaz.ua';
const NOVUS_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0',
  'Accept-Language': 'uk',
};

const CATEGORIES_TIMEOUT_MS = 5000;
const PRODUCTS_TIMEOUT_MS = 8000;
const CATEGORY_RETRY_BASE_MS = 200;

function readStoreId(env = {}) {
  const storeId = env.NOVUS_STORE_ID;
  if (!storeId) {
    throw new Error('Missing required env var NOVUS_STORE_ID for novus');
  }
  return storeId;
}

export async function getNovusCategoryTree(env = {}) {
  const storeId = readStoreId(env);
  const url = `${ZAKAZ_BASE}/stores/${storeId}/categories/`;

  try {
    return await withRetry(
      () => httpGetJson(url, { headers: NOVUS_HEADERS, timeoutMs: CATEGORIES_TIMEOUT_MS }),
      2,
      CATEGORY_RETRY_BASE_MS
    ).then(data => Array.isArray(data) ? data : []);
  } catch (err) {
    logError('api_request_failed', err, { store: 'novus', method: 'getCategories' });
    throw err;
  }
}

export async function getNovusCategories(env = {}) {
  const data = await getNovusCategoryTree(env);
  return flattenNestedCategories(data);
}

export async function getNovusProducts(categoryIdOrSlug, env = {}, categoriesTree = null) {
  const storeId = readStoreId(env);

  let categorySlug = categoryIdOrSlug;
  let categoryName = '';

  if (categoryIdOrSlug) {
    try {
      const tree = categoriesTree ?? await getNovusCategoryTree(env);
      // The UI stores the selected category id, but Novus product requests are
      // more reliable when we translate it back to the provider slug first.
      const category = findCategoryById(tree, categoryIdOrSlug);

      if (category) {
        categorySlug = category.slug || category.id;
        categoryName = String(category.title || '').trim();
      }
    } catch (err) {
      logError('category_lookup_failed', err, { store: 'novus', categoryId: categoryIdOrSlug });
    }
  }

  const products = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${ZAKAZ_BASE}/stores/${storeId}/categories/${categorySlug}/products/?page=${page}`;

    let data;
    try {
      data = await httpGetJson(url, { headers: NOVUS_HEADERS, timeoutMs: PRODUCTS_TIMEOUT_MS });
    } catch (err) {
      logError('api_request_failed', err, { store: 'novus', method: 'getProducts', page });
      throw err;
    }

    const results = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : [];

    if (results.length === 0) {
      break;
    }

    for (const item of results) {
      products.push(normalizeNovusProduct(item, categoryName));
    }

    if (data?.next) {
      page += 1;
    } else {
      hasMore = false;
    }
  }

  return {
    total: products.length,
    products,
  };
}

function normalizeNovusProduct(item, categoryName) {
  const hasPrice = item?.price !== null && item?.price !== undefined && item?.price !== '';
  const hasOldPrice = item?.old_price !== null && item?.old_price !== undefined && item?.old_price !== '';
  const price = hasPrice ? Number(item.price) / 100 : null;
  const oldPrice = hasOldPrice ? Number(item.old_price) / 100 : null;
  let discount = null;

  if (oldPrice !== null && price !== null && oldPrice > price) {
    discount = Math.round(((oldPrice - price) / oldPrice) * 100);
  } else if (item?.discount?.value) {
    discount = Number(item.discount.value) || null;
  }

  const name = String(item?.title ?? item?.name ?? 'Без назви').trim();
  let unit = item?.unit || '—';

  if (unit === 'pcs') unit = 'шт';
  else if (unit === 'kg') unit = 'кг';

  if (item?.weight) {
    unit = item.weight >= 1000 ? `${item.weight / 1000} кг` : `${item.weight} г`;
  } else if (item?.volume) {
    unit = item.volume >= 1000 ? `${item.volume / 1000} л` : `${item.volume} мл`;
  }

  const itemUrl = item?.web_url || item?.url || '';
  const absoluteUrl = itemUrl
    ? itemUrl.startsWith('http')
      ? itemUrl
      : `https://novus.zakaz.ua${itemUrl}`
    : `https://novus.zakaz.ua/uk/search/?q=${encodeURIComponent(name)}`;

  return {
    id: item?.ean || item?.sku || item?.id || '',
    store: 'Новус',
    name,
    category: categoryName || '',
    price,
    oldPrice,
    discount,
    unit,
    url: absoluteUrl,
    image: item?.img ? item.img.s150x150 || item.img.s350x350 || null : null,
  };
}
