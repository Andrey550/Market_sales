import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { withRetry } from '../src/utils/retry.js';

describe('withRetry', () => {
  test('возвращает результат при успехе с первой попытки', async () => {
    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      return 'ok';
    }, 3, 10);
    assert.equal(result, 'ok');
    assert.equal(calls, 1);
  });

  test('повторяет при сбое и возвращает результат при последующем успехе', async () => {
    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      if (calls < 3) throw new Error('boom');
      return 'ok';
    }, 3, 10);
    assert.equal(result, 'ok');
    assert.equal(calls, 3);
  });

  test('бросает последнюю ошибку после исчерпания попыток', async () => {
    let calls = 0;
    await assert.rejects(
      withRetry(async () => {
        calls++;
        throw new Error(`boom ${calls}`);
      }, 2, 10),
      /boom 3/
    );
    assert.equal(calls, 3);
  });

  test('НЕ повторяет при TimeoutError', async () => {
    let calls = 0;
    await assert.rejects(
      withRetry(async () => {
        calls++;
        const err = new Error('timeout');
        err.name = 'TimeoutError';
        throw err;
      }, 3, 10)
    );
    assert.equal(calls, 1);
  });

  test('НЕ повторяет при 4xx ошибке', async () => {
    let calls = 0;
    await assert.rejects(
      withRetry(async () => {
        calls++;
        const err = new Error('not found');
        err.status = 404;
        throw err;
      }, 3, 10)
    );
    assert.equal(calls, 1);
  });

  test('повторяет при 5xx ошибке', async () => {
    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      if (calls < 2) {
        const err = new Error('server error');
        err.status = 503;
        throw err;
      }
      return 'ok';
    }, 3, 10);
    assert.equal(result, 'ok');
    assert.equal(calls, 2);
  });
});
