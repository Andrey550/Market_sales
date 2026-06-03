export async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  try {
    return await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new Error(`Timeout: ${new URL(url).hostname} (${timeoutMs}ms)`);
    }
    throw err;
  }
}
