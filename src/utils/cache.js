import { logInfo } from './logger.js';
import { CORS_HEADERS } from './cors.js';

const API_CACHE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  ...CORS_HEADERS,
};

export async function withCache(request, ctx, fetcherFn, ttlSeconds = 900) {
  const cache = await caches.open('websales-api-v1');
  const cacheKey = new Request(request.url, { method: 'GET' });

  const cached = await cache.match(cacheKey);
  if (cached) {
    logInfo('cache_hit', { url: request.url });
    const hitResponse = cached.clone();
    hitResponse.headers.set('X-Cache', 'HIT');
    return hitResponse;
  }

  logInfo('cache_miss', { url: request.url });

  const data = await fetcherFn();
  const response = new Response(JSON.stringify(data), {
    headers: {
      ...API_CACHE_HEADERS,
      'Cache-Control': `public, max-age=${ttlSeconds}`,
      'X-Cache': 'MISS',
    },
  });

  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
