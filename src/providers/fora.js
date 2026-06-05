import { createRpcAdapter } from './rpc-adapter.js';

const foraAdapter = createRpcAdapter({
  baseUrl: 'https://api.catalog.ecom.fora.ua/api/2.0/exec/EcomCatalogGlobal',
  extraHeaders: {},
  filialIdKey: 'FORA_FILIAL_ID',
  merchantIdKey: 'FORA_MERCHANT_ID',
  deliveryTypeKey: 'FORA_DELIVERY_TYPE',
  deliveryTypeIsString: false,
  pageSize: 50,
  storeName: 'Фора',
  productUrlBase: 'https://fora.ua/product',
});

export const getForaCategoryTree = foraAdapter.getCategoryTree;
export const getForaCategories = foraAdapter.getCategories;
export const getForaProducts = foraAdapter.getProducts;
