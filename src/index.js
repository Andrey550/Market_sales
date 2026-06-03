import { mergeProductResults } from './catalog-utils.js';
import { getSilpoCategories, getSilpoProducts, getSilpoCategoryTree } from './providers/silpo.js';
import { getNovusCategories, getNovusProducts, getNovusCategoryTree } from './providers/novus.js';
import { getForaCategories, getForaProducts, getForaCategoryTree } from './providers/fora.js';
import { withCache } from './utils/cache.js';
import { logError, logInfo } from './utils/logger.js';
import { HTML_PAGE } from './page.js';

const CATEGORIES_TTL = 3600;
const PRODUCTS_TTL = 900;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function parseCategoryParam(categoryParam) {
  if (!categoryParam) {
    return [''];
  }

  const categories = categoryParam
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return categories.length > 0 ? categories : [''];
}

async function loadCategories(store, env) {
  switch (store) {
    case 'silpo': return getSilpoCategories(env);
    case 'novus': return getNovusCategories(env);
    case 'fora': return getForaCategories(env);
    default: throw new Error(`Unknown store: ${store}`);
  }
}

async function loadCategoryTree(store, env) {
  switch (store) {
    case 'silpo': return getSilpoCategoryTree(env);
    case 'novus': return getNovusCategoryTree(env);
    case 'fora': return getForaCategoryTree(env);
    default: throw new Error(`Unknown store: ${store}`);
  }
}

async function loadProducts(store, categoryId, env, categoriesTree) {
  switch (store) {
    case 'silpo': return getSilpoProducts(categoryId, env, categoriesTree);
    case 'novus': return getNovusProducts(categoryId, env, categoriesTree);
    case 'fora': return getForaProducts(categoryId, env, categoriesTree);
    default: throw new Error(`Unknown store: ${store}`);
  }
}

async function loadProductsForCategories(store, categories, env) {
  // Resolve the category tree once so per-category lookups don't re-fetch it
  // for every batch member (avoids the N+1 problem on multi-category loads).
  let tree = null;
  try {
    tree = await loadCategoryTree(store, env);
  } catch (err) {
    logError('category_tree_fetch_failed', err, { store });
  }

  const settlements = await Promise.allSettled(
    categories.map(category => loadProducts(store, category, env, tree))
  );
  const results = [];
  const errors = [];

  for (const settlement of settlements) {
    if (settlement.status === 'fulfilled') {
      results.push(settlement.value);
    } else {
      const message = settlement.reason?.message || 'Unknown products loading error';
      errors.push(message);
      logError('products_load_failed', settlement.reason, { store, message });
    }
  }

  const merged = mergeProductResults(results);
  if (errors.length > 0) {
    merged.errors = errors;
  }

  return merged;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const start = Date.now();

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return json({ error: 'Method Not Allowed' }, 405);
    }

    try {
      // Every provider is normalized to the same response format so the browser
      // UI can stay store-agnostic.
      const apiMatch = path.match(/^\/api\/(silpo|novus|fora)\/(categories|products)$/);
      if (apiMatch) {
        const [, store, endpoint] = apiMatch;
        if (endpoint === 'categories') {
          return withCache(request, ctx, () => loadCategories(store, env), CATEGORIES_TTL);
        }
        const categoryIds = parseCategoryParam(url.searchParams.get('category'));
        return withCache(request, ctx, () => loadProductsForCategories(store, categoryIds, env), PRODUCTS_TTL);
      }

      if (path === '/' || path === '/index.html') {
        return new Response(HTML_PAGE, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        });
      }

      logInfo('not_found', { path, method: request.method });
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err) {
      logError('request_failed', err, {
        path,
        method: request.method,
        duration: Date.now() - start
      });
      return json({ error: err.message }, 500);
    }
  },
};
