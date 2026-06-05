function parsePrice(value) {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function normalizeEcomProduct(item, { storeName, productUrlBase, categoryName = '' }) {
  const price = parsePrice(item?.price);
  const oldPrice = parsePrice(item?.oldPrice);
  const discount = (oldPrice !== null && price !== null && oldPrice > price)
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  return {
    id: item?.id ?? item?.article ?? item?.slug ?? '',
    store: storeName,
    name: item?.name || item?.title || 'Без назви',
    category: categoryName,
    price,
    oldPrice,
    discount,
    unit: item?.unitText || item?.unit || '—',
    url: item?.slug ? `${productUrlBase}/${item.slug}` : '#',
    image: item?.mainImage || null,
  };
}