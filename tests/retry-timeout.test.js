import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { withRetry } from '../src/utils/retry.js';

describe('withRetry + TimeoutError from real http path', () => {
  test('does NOT retry when error.name === "TimeoutError"', async () => {
    let calls = 0;
    await assert.rejects(
      withRetry(async () => {
        calls++;
        const err = new Error('Timeout: x (5ms)');
        err.name = 'TimeoutError';
        throw err;
      }, 3, 5)
    );
    assert.equal(calls, 1, 'timeout errors should not be retried');
  });
});
