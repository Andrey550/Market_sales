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
    store: 'Фора',
    name: item?.name || item?.title || 'Без назви',
    category: categoryName,
    price,
    oldPrice,
    discount,
    unit: item?.unitText || item?.unit || '—',
    url: item?.slug ? `https://fora.ua/product/${item.slug}` : '#',
    image: item?.mainImage || null,
  };
}

const foraAdapter = createRpcAdapter({
  baseUrl: 'https://api.catalog.ecom.fora.ua/api/2.0/exec/EcomCatalogGlobal',
  extraHeaders: {},
  filialIdKey: 'FORA_FILIAL_ID',
  merchantIdKey: 'FORA_MERCHANT_ID',
  deliveryTypeKey: 'FORA_DELIVERY_TYPE',
  defaultFilialId: 310,
  defaultMerchantId: 2,
  defaultDeliveryType: 2,
  pageSize: 50,
  storeName: 'Фора',
  normalizeProduct,
});

export const getForaCategoryTree = foraAdapter.getCategoryTree;
export const getForaCategories = foraAdapter.getCategories;
export const getForaProducts = foraAdapter.getProducts;
