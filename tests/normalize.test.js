import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEcomProduct } from '../src/providers/normalize.js';

describe('normalizeEcomProduct', () => {
  test('returns null price when missing or empty', () => {
    const a = normalizeEcomProduct({ name: 'A', slug: 'a' }, { storeName: 'X', productUrlBase: 'https://x' });
    assert.equal(a.price, null);

    const b = normalizeEcomProduct({ name: 'B', slug: 'b', price: '' }, { storeName: 'X', productUrlBase: 'https://x' });
    assert.equal(b.price, null);
  });

  test('preserves explicit zero price', () => {
    const a = normalizeEcomProduct({ name: 'A', slug: 'a', price: 0 }, { storeName: 'X', productUrlBase: 'https://x' });
    assert.equal(a.price, 0);
  });

  test('computes discount only when both prices are valid and oldPrice > price', () => {
    const a = normalizeEcomProduct(
      { name: 'A', slug: 'a', price: 80, oldPrice: 100 },
      { storeName: 'X', productUrlBase: 'https://x' }
    );
    assert.equal(a.price, 80);
    assert.equal(a.oldPrice, 100);
    assert.equal(a.discount, 20);

    const b = normalizeEcomProduct(
      { name: 'B', slug: 'b', price: 100, oldPrice: 50 },
      { storeName: 'X', productUrlBase: 'https://x' }
    );
    assert.equal(b.discount, null);

    const c = normalizeEcomProduct(
      { name: 'C', slug: 'c', price: null, oldPrice: 100 },
      { storeName: 'X', productUrlBase: 'https://x' }
    );
    assert.equal(c.price, null);
    assert.equal(c.discount, null);
  });

  test('falls back to article or slug for id', () => {
    const a = normalizeEcomProduct({ name: 'A', article: 123 }, { storeName: 'X', productUrlBase: 'https://x' });
    assert.equal(a.id, 123);
  });
});
