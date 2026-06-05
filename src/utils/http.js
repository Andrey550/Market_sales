export async function httpGetJson(url, { headers = {}, timeoutMs = 8000 } = {}) {
  const resp = await fetchWithTimeout(url, { headers }, timeoutMs);
  await throwIfNotOk(resp, 'GET', url);
  return resp.json();
}

export async function httpPostJson(url, body, { headers = {}, timeoutMs = 8000 } = {}) {
  const resp = await fetchWithTimeout(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }, timeoutMs);
  await throwIfNotOk(resp, 'POST', url);
  return resp.json();
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  try {
    return await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      const wrapped = new Error(`Timeout: ${new URL(url).hostname} (${timeoutMs}ms)`);
      wrapped.name = 'TimeoutError';
      throw wrapped;
    }
    throw err;
  }
}

async function throwIfNotOk(resp, method, url) {
  if (resp.ok) return;

  const text = await resp.text();
  const err = new Error(`${method} ${url} failed: ${resp.status} - ${text.substring(0, 200)}`);
  err.status = resp.status;
  throw err;
}
