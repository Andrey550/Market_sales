import * as silpo from './silpo.js';
import * as novus from './novus.js';
import * as fora from './fora.js';

export const PROVIDERS = {
  silpo: {
    getCategoryTree: silpo.getSilpoCategoryTree,
    getCategories: silpo.getSilpoCategories,
    getProducts: silpo.getSilpoProducts,
  },
  novus: {
    getCategoryTree: novus.getNovusCategoryTree,
    getCategories: novus.getNovusCategories,
    getProducts: novus.getNovusProducts,
  },
  fora: {
    getCategoryTree: fora.getForaCategoryTree,
    getCategories: fora.getForaCategories,
    getProducts: fora.getForaProducts,
  },
};

export function getProvider(store) {
  const provider = PROVIDERS[store];
  if (!provider) {
    throw new Error(`Unknown store: ${store}`);
  }
  return provider;
}
