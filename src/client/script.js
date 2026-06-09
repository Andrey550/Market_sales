export const CLIENT_SCRIPT = `
    const STORE_LABELS = { silpo: 'Сільпо', novus: 'Новус', fora: 'Фора' };
    const STORE_EMOJI = { silpo: '🌲', novus: '🟡', fora: '⚓' };
    const STORE_BADGE_KEY = { 'Сільпо': 'silpo', 'Новус': 'novus', 'Фора': 'fora' };

    const state = {
      activeStores: { silpo: true, novus: true, fora: true },
      allProducts: [],
      displayProducts: [],
      currentSort: 'discount-desc',
      lastRawCount: 0,
      lastErrors: [],
      loading: false
    };

    const filtersEl = document.getElementById('filters');
    const filterToggleEl = document.getElementById('filterToggle');
    const chipEls = {
      silpo: document.getElementById('chipSilpo'),
      novus: document.getElementById('chipNovus'),
      fora:  document.getElementById('chipFora')
    };
    const searchInput = document.getElementById('searchInput');
    const discountMinInput = document.getElementById('discountMin');
    const discountMaxInput = document.getElementById('discountMax');
    const btnFind = document.getElementById('btnFind');
    const productsEl = document.getElementById('products');
    const countEl = document.getElementById('count');
    const statusInfoEl = document.getElementById('statusInfo');
    const sortButtons = document.querySelectorAll('.sort-btn');

    function safeLower(value) {
      return String(value || '').toLowerCase();
    }
    function toNumber(value) {
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    }
    function formatPrice(value) {
      return value == null ? '—' : toNumber(value).toFixed(2) + ' ₴';
    }
    function esc(value) {
      if (value == null) return '';
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function safeUrl(value) {
      if (value == null) return '';
      const raw = String(value).trim();
      if (!raw) return '';
      try {
        const u = new URL(raw, window.location.origin);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
        return u.toString();
      } catch (e) {
        return '';
      }
    }

    function toggleFilters() {
      filtersEl.classList.toggle('collapsed');
      const isCollapsed = filtersEl.classList.contains('collapsed');
      filterToggleEl.textContent = isCollapsed ? '▶ Фільтри' : '▼ Фільтри';
    }

    function toggleStore(key) {
      state.activeStores[key] = !state.activeStores[key];
      const chip = chipEls[key];
      if (chip) chip.classList.toggle('active', state.activeStores[key]);
      if (state.allProducts.length > 0) {
        filterAndRender();
      }
    }

    function onSearch() { filterAndRender(); }
    function onDiscountMin() { filterAndRender(); }
    function onDiscountMax() { filterAndRender(); }

    function sort(key) {
      state.currentSort = key;
      sortButtons.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.sort === key);
      });
      filterAndRender();
    }

    async function readJsonResponse(resp, fallbackMessage) {
      let data;
      try {
        data = await resp.json();
      } catch (error) {
        if (!resp.ok) {
          throw new Error(fallbackMessage || ('HTTP ' + resp.status));
        }
        throw new Error('Некоректна JSON-відповідь від сервера.');
      }
      if (!resp.ok) {
        throw new Error((data && data.error) || fallbackMessage || ('HTTP ' + resp.status));
      }
      return data;
    }

    async function loadProducts() {
      if (state.loading) return;
      const stores = Object.keys(state.activeStores).filter(function(k) { return state.activeStores[k]; });
      if (stores.length === 0) {
        statusInfoEl.textContent = 'Оберіть хоча б один магазин';
        statusInfoEl.classList.add('status-error');
        return;
      }

      state.loading = true;
      btnFind.disabled = true;
      statusInfoEl.textContent = 'Завантаження...';
      statusInfoEl.classList.remove('status-error');
      productsEl.innerHTML = '<div class="loader"><span class="loader-dot"></span><span class="loader-dot"></span><span class="loader-dot"></span></div>';
      countEl.textContent = '0';

      try {
        const settlements = await Promise.allSettled(stores.map(async function(store) {
          const catResp = await fetch('/api/' + store + '/categories');
          const categories = await readJsonResponse(catResp, 'Не вдалося завантажити категорії для ' + STORE_LABELS[store] + '.');
          const valid = Array.isArray(categories)
            ? categories.filter(function(c) { return c && c.id && c.count; })
            : [];
          if (valid.length === 0) {
            return { store: store, data: { products: [] } };
          }
          const ids = valid.map(function(c) { return c.id; }).join(',');
          const prodResp = await fetch('/api/' + store + '/products?category=' + encodeURIComponent(ids));
          const data = await readJsonResponse(prodResp, 'Не вдалося завантажити товари для ' + STORE_LABELS[store] + '.');
          return { store: store, data: data };
        }));

        const merged = [];
        const errors = [];
        let rawCount = 0;
        settlements.forEach(function(settlement, index) {
          const store = stores[index];
          const storeLabel = STORE_LABELS[store] || store;
          if (settlement.status !== 'fulfilled') {
            errors.push(storeLabel + ': ' + (settlement.reason && settlement.reason.message ? settlement.reason.message : 'Невідома помилка.'));
            return;
          }
          if (!settlement.value) return;
          const data = settlement.value.data || {};
          const products = Array.isArray(data.products) ? data.products : [];
          merged.push.apply(merged, products);
          rawCount += data.rawTotal || data.total || products.length;
          if (Array.isArray(data.errors) && data.errors.length > 0) {
            errors.push(storeLabel + ': ' + data.errors.join(', '));
          }
        });

        state.allProducts = merged;
        state.lastRawCount = rawCount || merged.length;
        state.lastErrors = errors;
      } catch (error) {
        state.allProducts = [];
        state.lastRawCount = 0;
        state.lastErrors = [error.message || 'Невідома помилка'];
      } finally {
        state.loading = false;
        btnFind.disabled = false;
        filterAndRender();
      }
    }

    function filterAndRender() {
      const query = safeLower(searchInput.value.trim());
      const minDiscount = toNumber(discountMinInput.value);
      const maxDiscount = toNumber(discountMaxInput.value);
      const activeStoreSet = Object.keys(state.activeStores)
        .filter(function(k) { return state.activeStores[k]; })
        .reduce(function(acc, k) { acc[STORE_LABELS[k]] = true; return acc; }, {});

      state.displayProducts = state.allProducts.filter(function(p) {
        const storeMatch = !p || !p.store || activeStoreSet[p.store] !== false;
        if (!storeMatch) return false;
        const textMatch = !query
          || safeLower(p && p.name).includes(query)
          || safeLower(p && p.category).includes(query)
          || safeLower(p && p.store).includes(query);
        const discount = Math.abs(toNumber(p && p.discount));
        const discountMatch = (minDiscount === 0 || discount >= minDiscount) && (maxDiscount === 0 || discount <= maxDiscount);
        return textMatch && discountMatch;
      });

      const sortKey = state.currentSort;
      let realKey, dir;
      if (sortKey === 'price-asc')   { realKey = 'price';    dir = 1; }
      else if (sortKey === 'price-desc') { realKey = 'price';    dir = -1; }
      else if (sortKey === 'name')       { realKey = 'name';     dir = 1; }
      else                                { realKey = 'discount'; dir = -1; }

      state.displayProducts.sort(function(a, b) {
        let vA = a[realKey];
        let vB = b[realKey];
        if (realKey === 'discount') {
          vA = vA != null ? Math.abs(toNumber(vA)) : null;
          vB = vB != null ? Math.abs(toNumber(vB)) : null;
        }
        if (vA == null && vB == null) return 0;
        if (vA == null) return 1;
        if (vB == null) return -1;
        if (typeof vA === 'number' && typeof vB === 'number') {
          return (vA - vB) * dir;
        }
        return String(vA).localeCompare(String(vB), 'uk') * dir;
      });

      renderProducts();
    }

    function renderProducts() {
      countEl.textContent = state.displayProducts.length;
      if (state.displayProducts.length === 0) {
        productsEl.innerHTML = renderEmpty();
        updateStatusInfo();
        return;
      }
      const html = state.displayProducts.map(renderProduct).join('');
      productsEl.innerHTML = html;
      updateStatusInfo();
    }

    function updateStatusInfo() {
      if (state.lastErrors.length > 0) {
        statusInfoEl.textContent = 'Помилки: ' + state.lastErrors.join(' | ');
        statusInfoEl.classList.add('status-error');
        return;
      }
      if (state.allProducts.length === 0) {
        statusInfoEl.textContent = 'Оберіть магазини та натисніть «Знайти»';
        statusInfoEl.classList.remove('status-error');
        return;
      }
      const duplicateCount = state.allProducts.length > 0
        ? Math.max(0, state.lastRawCount - state.allProducts.length)
        : 0;
      const duplicateNote = duplicateCount > 0 ? ' (без дублів: ' + duplicateCount + ')' : '';
      if (state.displayProducts.length !== state.allProducts.length) {
        statusInfoEl.textContent = 'Показано ' + state.displayProducts.length + ' з ' + state.allProducts.length + duplicateNote;
      } else {
        statusInfoEl.textContent = 'Завантажено ' + state.allProducts.length + duplicateNote;
      }
      statusInfoEl.classList.remove('status-error');
    }

    function renderProduct(p) {
      const discount = p.discount != null ? Math.abs(toNumber(p.discount)) : null;
      const discountClass = discount === null ? '' : discount >= 50 ? 'hot' : discount >= 20 ? 'mid' : '';
      const storeKey = STORE_BADGE_KEY[p.store] || '';
      const storeEmoji = STORE_EMOJI[storeKey] || '•';
      const oldPriceHtml = p.oldPrice && toNumber(p.oldPrice) > 0
        ? '<span class="price-old">' + esc(formatPrice(p.oldPrice)) + '</span>'
        : '';
      const discountHtml = discount !== null
        ? '<span class="product-discount ' + discountClass + '">−' + discount + '%</span>'
        : '';
      const imageHtml = p.image
        ? '<img class="product-image" src="' + esc(safeUrl(p.image)) + '" loading="lazy" alt="" />'
        : '<div class="product-image-placeholder">📦</div>';
      const linkHref = safeUrl(p.url);
      const linkHtml = linkHref
        ? '<a class="product-link" href="' + esc(linkHref) + '" target="_blank" rel="noopener noreferrer">Відкрити в магазині →</a>'
        : '';

      return '<article class="product-card" data-store="' + esc(storeKey) + '">' +
        imageHtml +
        '<div class="product-body">' +
          '<div class="product-name">' + esc(p.name) + '</div>' +
          '<div class="product-meta">' +
            '<span class="product-store-badge ' + esc(storeKey) + '">' + storeEmoji + ' ' + esc(p.store) + '</span>' +
            '<span class="product-category">' + esc(p.category || '—') + '</span>' +
          '</div>' +
          '<div class="product-footer">' +
            '<div class="product-price">' +
              '<span class="price-current">' + esc(formatPrice(p.price)) + '</span>' +
              oldPriceHtml +
            '</div>' +
            discountHtml +
          '</div>' +
          linkHtml +
        '</div>' +
      '</article>';
    }

    function renderEmpty() {
      const neverSearched = state.lastRawCount === 0 && state.lastErrors.length === 0;
      const icon = neverSearched ? '🔍' : '🎯';
      const title = neverSearched
        ? 'Оберіть магазини та натисніть «Знайти»'
        : 'Немає товарів за вашим запитом';
      const sub = neverSearched
        ? 'Натисніть кнопку «Знайти», щоб побачити актуальні товари'
        : 'Спробуйте змінити фільтри або скинути пошук';
      return '<div class="empty-state">' +
        '<div class="empty-state-icon">' + icon + '</div>' +
        '<div class="empty-state-title">' + title + '</div>' +
        '<div class="empty-state-sub">' + sub + '</div>' +
      '</div>';
    }

    filterToggleEl.addEventListener('click', toggleFilters);
    chipEls.silpo.addEventListener('click', function() { toggleStore('silpo'); });
    chipEls.novus.addEventListener('click', function() { toggleStore('novus'); });
    chipEls.fora.addEventListener('click',  function() { toggleStore('fora'); });
    searchInput.addEventListener('input', onSearch);
    discountMinInput.addEventListener('input', onDiscountMin);
    discountMaxInput.addEventListener('input', onDiscountMax);
    btnFind.addEventListener('click', function() { if (!state.loading) loadProducts(); });
    sortButtons.forEach(function(btn) {
      btn.addEventListener('click', function() { sort(btn.dataset.sort); });
    });

    if (window.matchMedia('(max-width: 420px)').matches) {
      filtersEl.classList.add('collapsed');
      filterToggleEl.textContent = '▶ Фільтри';
    }

    // === Telegram Mini App integration ===
    (function initTelegram() {
      const tg = window.Telegram && window.Telegram.WebApp;
      if (!tg) return;

      try {
        tg.ready();
        tg.expand();

        const params = tg.themeParams || {};
        const setVar = (name, value) => {
          if (value) document.documentElement.style.setProperty(name, value);
        };
        setVar('--bg-primary', params.bg_color);
        setVar('--bg-card', params.secondary_bg_color || params.bg_color);
        setVar('--text-primary', params.text_color);
        setVar('--text-secondary', params.hint_color);
        setVar('--action-primary', params.button_color);
        setVar('--action-primary-hover', params.button_color);
        if (params.button_text_color) {
          setVar('--action-primary-fg', params.button_text_color);
        }

        const headerColor = params.header_bg_color || params.bg_color;
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta && headerColor) meta.setAttribute('content', headerColor);

        tg.setHeaderColor && tg.setHeaderColor(headerColor || 'bg_color');
        tg.setBackgroundColor && tg.setBackgroundColor(params.bg_color || '#121315');

        const back = tg.BackButton;
        if (back) {
          back.show();
          back.onClick(function() { tg.close(); });
        }

        const main = tg.MainButton;
        if (main) {
          main.setText('Знайти товари');
          main.show();
          main.onClick(function() {
            if (!state.loading) loadProducts();
          });
        }

        tg.onEvent && tg.onEvent('themeChanged', function() {
          const next = tg.themeParams || {};
          setVar('--bg-primary', next.bg_color);
          setVar('--bg-card', next.secondary_bg_color || next.bg_color);
          setVar('--text-primary', next.text_color);
          setVar('--text-secondary', next.hint_color);
        });
      } catch (err) {
        console.error('Telegram WebApp init failed', err);
      }
    })();
`;
