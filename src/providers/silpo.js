import { createRpcAdapter } from './rpc-adapter.js';

function normalizeProduct(item, categoryName = '') {
  const price = Number(item?.price) || 0;
  const oldPrice = Number(item?.oldPrice) || null;
  let discount = null;

  if (oldPrice && oldPrice > price) {
    discount = Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  return {
    id: item?.id ?? item?.article ?? item?.slug ?? '',
    store: 'Сільпо',
    name: item?.name || item?.title || 'Без назви',
    category: categoryName,
    price,
    oldPrice,
    discount,
    unit: item?.unitText || item?.unit || '—',
    url: item?.slug ? `https://silpo.ua/product/${item.slug}` : '#',
    image: item?.mainImage || null,
  };
}

const silpoAdapter = createRpcAdapter({
  baseUrl: 'https://api.catalog.ecom.silpo.ua/api/2.0/exec/EcomCatalogGlobal',
  extraHeaders: {
    Origin: 'https://silpo.ua',
    Referer: 'https://silpo.ua/',
  },
  filialIdKey: 'SILPO_FILIAL_ID',
  deliveryTypeKey: 'SILPO_DELIVERY_TYPE',
  defaultFilialId: 2028,
  defaultDeliveryType: 'DeliveryHome',
  pageSize: 100,
  storeName: 'Сільпо',
  normalizeProduct,
});

export const getSilpoCategoryTree = silpoAdapter.getCategoryTree;
export const getSilpoCategories = silpoAdapter.getCategories;
export const getSilpoProducts = silpoAdapter.getProducts;
