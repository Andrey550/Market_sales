import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeProductResults,
  findCategoryById,
  flattenParentCategories
} from '../src/catalog-utils.js';

describe('mergeProductResults', () => {
  test('дедуплицирует товары по store:id', () => {
    const product = {
      id: '123',
      store: 'Сільпо',
      name: 'Молоко',
      price: 30
    };

    const result = mergeProductResults([
      { products: [product, product, product] }
    ]);

    assert.equal(result.total, 1, 'Должен остаться один товар');
    assert.equal(result.rawTotal, 3, 'rawTotal должен показать 3');
  });

  test('НЕ дедуплицирует товары с одинаковым именем из разных магазинов', () => {
    const silpo = { id: '1', store: 'Сільпо', name: 'Молоко', price: 30 };
    const fora = { id: '1', store: 'Фора', name: 'Молоко', price: 28 };

    const result = mergeProductResults([
      { products: [silpo] },
      { products: [fora] }
    ]);

    assert.equal(result.total, 2, 'Должны быть два разных товара');
  });
});

describe('findCategoryById', () => {
  test('находит категорию в плоском списке', () => {
    const tree = [
      { id: '1', title: 'Фрукти', parentId: null },
      { id: '2', title: 'Яблука', parentId: '1' }
    ];

    const found = findCategoryById(tree, '2');
    assert.equal(found.title, 'Яблука');
  });

  test('находит категорию во вложенном дереве', () => {
    const tree = [{
      id: '1',
      title: 'Фрукти',
      children: [{
        id: '2',
        title: 'Яблука',
        children: [{ id: '3', title: 'Голден' }]
      }]
    }];

    const found = findCategoryById(tree, '3');
    assert.equal(found.title, 'Голден');
  });

  test('возвращает null для несуществующего id', () => {
    const tree = [{ id: '1', title: 'Фрукти' }];
    const found = findCategoryById(tree, '999');
    assert.equal(found, null);
  });
});

describe('flattenParentCategories', () => {
  test('возвращает плоский список корневых категорий', () => {
    const flat = [
      { id: '1', title: 'Фрукти', parentId: null, count: 100 },
      { id: '2', title: 'Яблука', parentId: '1', count: 50 },
      { id: '3', title: 'Груші', parentId: '1', count: 30 }
    ];

    const result = flattenParentCategories(flat);

    assert.equal(result.length, 1, 'Должна быть одна корневая категория');
    assert.equal(result[0].title, 'Фрукти');
    assert.equal(result[0].id, '1');
  });

  test('игнорирует вложенные категории', () => {
    const flat = [
      { id: '1', title: 'Фрукти', parentId: null, count: 100 },
      { id: '2', title: 'Яблука', parentId: '1', count: 50 }
    ];

    const result = flattenParentCategories(flat);

    assert.equal(result.length, 1);
    assert.equal(result[0].title, 'Фрукти');
  });
});
