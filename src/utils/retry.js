export async function withRetry(fn, maxRetries = 3, baseDelayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (error.name === 'TimeoutError' ||
          error.name === 'AbortError' ||
          (error.status && error.status >= 400 && error.status < 500)) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
