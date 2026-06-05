import { createRpcAdapter } from './rpc-adapter.js';

const silpoAdapter = createRpcAdapter({
  baseUrl: 'https://api.catalog.ecom.silpo.ua/api/2.0/exec/EcomCatalogGlobal',
  extraHeaders: {
    Origin: 'https://silpo.ua',
    Referer: 'https://silpo.ua/',
  },
  filialIdKey: 'SILPO_FILIAL_ID',
  deliveryTypeKey: 'SILPO_DELIVERY_TYPE',
  pageSize: 100,
  storeName: 'Сільпо',
  productUrlBase: 'https://silpo.ua/product',
});

export const getSilpoCategoryTree = silpoAdapter.getCategoryTree;
export const getSilpoCategories = silpoAdapter.getCategories;
export const getSilpoProducts = silpoAdapter.getProducts;
