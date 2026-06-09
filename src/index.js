import { mergeProductResults } from './catalog-utils.js';
import { getProvider } from './providers/registry.js';
import { withCache } from './utils/cache.js';
import { CORS_HEADERS } from './utils/cors.js';
import { logError, logInfo } from './utils/logger.js';
import { HTML_PAGE } from './page.js';

const CATEGORIES_TTL = 3600;
const PRODUCTS_TTL = 300;

const corsHeaders = CORS_HEADERS;

const VALID_CATEGORY_ID = /^[a-zA-Z0-9._-]{1,64}$/;

function parseCategoryParam(categoryParam) {
  if (!categoryParam) {
    return [];
  }

  const seen = new Set();
  for (const value of categoryParam.split(',')) {
    const trimmed = value.trim();
    if (trimmed && VALID_CATEGORY_ID.test(trimmed)) {
      seen.add(trimmed);
    }
  }
  return Array.from(seen);
}

async function loadCategories(store, env) {
  return getProvider(store).getCategories(env);
}

async function loadCategoryTree(store, env) {
  return getProvider(store).getCategoryTree(env);
}

async function loadProducts(store, categoryId, env, categoriesTree) {
  return getProvider(store).getProducts(categoryId, env, categoriesTree);
}

async function loadProductsForCategories(store, categories, env) {
  if (categories.length === 0) {
    return { total: 0, rawTotal: 0, products: [] };
  }

  // Resolve the category tree once so per-category lookups don't re-fetch it
  // for every batch member (avoids the N+1 problem on multi-category loads).
  let tree = null;
  try {
    tree = await loadCategoryTree(store, env);
  } catch (err) {
    logError('category_tree_fetch_failed', err, { store });
  }

  // If the shared tree failed to load, do NOT fall back to per-category tree
  // fetches inside loadProducts — that would create an N+1 storm. Instead,
  // report a single error and let the caller decide how to proceed.
  if (tree === null) {
    return {
      total: 0,
      rawTotal: 0,
      products: [],
      errors: ['Не вдалося завантажити дерево категорій — спробуйте пізніше.'],
    };
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
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders,
  };
  if (status >= 400) {
    headers['Cache-Control'] = 'no-store';
  }
  return new Response(JSON.stringify(data), {
    status,
    headers,
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
            'Content-Security-Policy': "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self' https://web.telegram.org https://t.me; img-src 'self' https: data:; style-src 'unsafe-inline'; script-src 'unsafe-inline' 'unsafe-eval' https://telegram.org; connect-src 'self' https:; font-src https: data:",
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
      return json({ error: 'Internal Server Error' }, 500);
    }
  },
};
