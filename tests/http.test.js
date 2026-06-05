import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { httpGetJson } from '../src/utils/http.js';

describe('http error wrapping', () => {
  test('timeout error preserves name=TimeoutError for withRetry', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      const err = new Error('aborted');
      err.name = 'AbortError';
      throw err;
    };

    try {
      await assert.rejects(
        httpGetJson('https://example.invalid/api', { timeoutMs: 100 }),
        (err) => {
          assert.equal(err.name, 'TimeoutError');
          assert.match(err.message, /Timeout:/);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('non-timeout errors are re-thrown unchanged', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new TypeError('network down');
    };

    try {
      await assert.rejects(
        httpGetJson('https://example.invalid/api', { timeoutMs: 100 }),
        (err) => {
          assert.equal(err.name, 'TypeError');
          assert.equal(err.message, 'network down');
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
