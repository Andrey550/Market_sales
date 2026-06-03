const ROOT_KEY = '__root__';

function getNumericSortValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getCategoryTitle(category) {
  return String(category?.name ?? category?.title ?? '').trim();
}

function compareCategories(a, b) {
  const orderDiff =
    getNumericSortValue(a?.order ?? a?.position) -
    getNumericSortValue(b?.order ?? b?.position);

  if (orderDiff !== 0) {
    return orderDiff;
  }

  return getCategoryTitle(a).localeCompare(getCategoryTitle(b), 'uk');
}

export function flattenParentCategories(categories) {
  const list = Array.isArray(categories) ? categories : [];
  // Some providers return a flat category list with parent ids instead of a
  // ready-made nested tree, so we group them first and keep only root entries.
  const knownIds = new Set(
    list
      .map(category => category?.id)
      .filter(id => id !== null && id !== undefined && id !== '')
      .map(id => String(id))
  );

  const childrenByParent = new Map();

  for (const category of list) {
    const rawParentId = category?.parentId ?? category?.parent_id ?? null;
    const parentKey =
      rawParentId === null ||
      rawParentId === undefined ||
      rawParentId === 0 ||
      rawParentId === '0' ||
      !knownIds.has(String(rawParentId))
        ? ROOT_KEY
        : String(rawParentId);

    if (!childrenByParent.has(parentKey)) {
      childrenByParent.set(parentKey, []);
    }

    childrenByParent.get(parentKey).push(category);
  }

  return (childrenByParent.get(ROOT_KEY) || [])
    .sort(compareCategories)
    .map(category => {
      const title = getCategoryTitle(category);
      const count = category?.itemsCount ?? category?.count ?? 0;

      if (!title || count === 0) {
        return null;
      }

      return {
        id: category.id,
        slug: category.slug ?? category.id,
        title,
        count,
        parentId: category?.parentId ?? category?.parent_id ?? null,
      };
    })
    .filter(Boolean);
}

export function flattenNestedCategories(categories, depth = 0) {
  if (depth > 0) {
    return [];
  }

  const list = Array.isArray(categories) ? categories : [];

  return [...list]
    .sort(compareCategories)
    .map(category => {
      const title = getCategoryTitle(category);
      const count = category?.itemsCount ?? category?.count ?? 0;

      if (!title || count === 0) {
        return null;
      }

      return {
        id: category.id,
        slug: category.slug ?? category.id,
        title,
        count,
        parentId: category?.parentId ?? category?.parent_id ?? null,
      };
    })
    .filter(Boolean);
}

export function findCategoryById(categories, categoryId) {
  if (!categoryId) return null;

  const expectedId = String(categoryId);
  // Breadth-first traversal keeps this helper safe for both shallow and deeply
  // nested provider trees.
  const queue = Array.isArray(categories) ? [...categories] : [];

  while (queue.length > 0) {
    const category = queue.shift();

    if (String(category?.id) === expectedId) {
      return category;
    }

    if (Array.isArray(category?.children) && category.children.length > 0) {
      queue.push(...category.children);
    }
  }

  return null;
}

function getStableProductKey(product) {
  if (!product || !product.store) return null;

  if (product.id !== null && product.id !== undefined && product.id !== '') {
    return `${product.store}:id:${product.id}`;
  }

  return null;
}

export function mergeProductResults(results) {
  const mergedProducts = [];
  const seenKeys = new Set();
  let rawTotal = 0;

  for (const result of Array.isArray(results) ? results : []) {
    if (!result) continue;

    const products = Array.isArray(result.products) ? result.products : [];
    rawTotal += result.total ?? products.length;

    for (const product of products) {
      const key = getStableProductKey(product);

      // Deduplicate only by a stable provider id. Name-based matching would
      // incorrectly merge different products with similar titles.
      if (key && seenKeys.has(key)) {
        continue;
      }

      if (key) {
        seenKeys.add(key);
      }

      mergedProducts.push(product);
    }
  }

  return {
    total: mergedProducts.length,
    rawTotal,
    products: mergedProducts,
  };
}
