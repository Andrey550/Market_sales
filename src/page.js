export const HTML_PAGE = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSales · Система пошуку акцій</title>
  <style>
    :root {
      --bg-primary: #121315;
      --bg-card: #1A1C1E;
      --bg-card-hover: #1F2123;
      --border-card: #2B2E33;
      --text-primary: #F3F4F6;
      --text-secondary: #8A9099;
      --text-muted: #5E646E;

      --store-silpo: #4A5D47;
      --store-silpo-soft: rgba(74, 93, 71, 0.15);
      --store-novus: #C99A4E;
      --store-novus-soft: rgba(201, 154, 78, 0.15);
      --store-fora: #4C6A80;
      --store-fora-soft: rgba(76, 106, 128, 0.15);

      --discount-low: #5E646E;
      --discount-mid: #C99A4E;
      --discount-hot: #B86B5C;

      --action-primary: #3F4F41;
      --action-primary-hover: rgba(63, 79, 65, 0.8);
      --action-danger: #B86B5C;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 14px;
      line-height: 1.5;
    }

    body { padding: 0; }

    /* === Layout === */
    .app {
      max-width: 480px;
      margin: 0 auto;
      min-height: 100vh;
      background: var(--bg-primary);
      border-left: 1px solid rgba(43, 46, 51, 0.2);
      border-right: 1px solid rgba(43, 46, 51, 0.2);
    }

    .app-header {
      position: sticky;
      top: 0;
      z-index: 40;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-card);
      padding: 12px 16px;
    }

    .app-title {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    .app-title strong {
      color: var(--text-primary);
      font-weight: 600;
    }
    .app-subtitle {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* === Filters === */
    .filters {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }

    .filter-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--bg-primary);
      border: 1px solid var(--border-card);
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .filter-chip:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }
    .filter-chip.active {
      background: var(--action-primary);
      border-color: var(--action-primary);
      color: var(--text-primary);
    }
    .filter-chip[data-store="silpo"].active {
      background: var(--store-silpo);
      border-color: var(--store-silpo);
    }
    .filter-chip[data-store="novus"].active {
      background: var(--store-novus);
      border-color: var(--store-novus);
      color: #1A1C1E;
    }
    .filter-chip[data-store="fora"].active {
      background: var(--store-fora);
      border-color: var(--store-fora);
    }
    .filter-chip-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .filter-input {
      flex: 1;
      min-width: 120px;
      padding: 8px 12px;
      background: var(--bg-primary);
      border: 1px solid var(--border-card);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 13px;
      font-family: inherit;
      transition: border-color 0.15s ease;
    }
    .filter-input::placeholder { color: rgba(138, 144, 153, 0.5); }
    .filter-input:focus { outline: none; border-color: var(--action-primary); }

    .filter-range {
      display: flex;
      gap: 6px;
      align-items: center;
      flex: 1;
      min-width: 150px;
    }
    .filter-range-sep { color: var(--text-muted); font-size: 12px; }

    .btn-primary {
      flex: 1;
      padding: 10px 16px;
      background: var(--action-primary);
      border: none;
      border-radius: 10px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .btn-primary:hover { background: var(--action-primary-hover); }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .filter-toggle {
      display: none;
      padding: 8px 12px;
      background: var(--bg-primary);
      border: 1px solid var(--border-card);
      border-radius: 10px;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      font-family: inherit;
      margin-top: 8px;
    }

    @media (max-width: 420px) {
      .filter-toggle { display: block; }
      .filters.collapsed { display: none; }
    }

    /* === Status bar === */
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      font-size: 11px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid var(--border-card);
    }
    .status-bar strong { color: var(--text-primary); font-weight: 600; }
    .status-error { color: var(--discount-hot); }

    /* === Product cards === */
    .products {
      padding: 8px 12px 80px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .product-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 14px;
      padding: 12px;
      display: flex;
      gap: 12px;
      transition: background 0.15s ease;
      cursor: pointer;
    }
    .product-card:hover { background: var(--bg-card-hover); }
    .product-card[data-store="Сільпо"] { border-left: 3px solid var(--store-silpo); }
    .product-card[data-store="Новус"]  { border-left: 3px solid var(--store-novus); }
    .product-card[data-store="Фора"]   { border-left: 3px solid var(--store-fora); }

    .product-image {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      border-radius: 10px;
      background: var(--bg-primary);
      object-fit: cover;
    }
    .product-image-placeholder {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      border-radius: 10px;
      background: var(--bg-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: var(--text-muted);
    }

    .product-body {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .product-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .product-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 11px;
      color: var(--text-secondary);
    }
    .product-store-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .product-store-badge.silpo { background: var(--store-silpo-soft); color: var(--store-silpo); }
    .product-store-badge.novus { background: var(--store-novus-soft); color: var(--store-novus); }
    .product-store-badge.fora  { background: var(--store-fora-soft);  color: var(--store-fora); }
    .product-category {
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 4px;
      gap: 8px;
    }
    .product-price {
      display: flex;
      align-items: baseline;
      gap: 6px;
      flex-wrap: wrap;
    }
    .price-current { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .price-old {
      font-size: 11px;
      color: var(--text-muted);
      text-decoration: line-through;
    }
    .price-unit { font-size: 10px; color: var(--text-muted); margin-left: 2px; }

    .product-discount {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      background: var(--discount-low);
      color: var(--text-primary);
      white-space: nowrap;
    }
    .product-discount.mid { background: var(--discount-mid); color: #1A1C1E; }
    .product-discount.hot {
      background: var(--discount-hot);
      color: var(--text-primary);
      animation: pulse-hot 2s ease-in-out infinite;
    }
    @keyframes pulse-hot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.75; }
    }

    .product-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.15s ease;
      align-self: flex-start;
    }
    .product-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }

    /* === Empty state === */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }
    .empty-state-icon { font-size: 36px; margin-bottom: 16px; }
    .empty-state-title { color: var(--text-secondary); font-size: 13px; margin-bottom: 4px; }
    .empty-state-sub { color: rgba(138, 144, 153, 0.6); font-size: 12px; }

    /* === Loader === */
    .loader {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    .loader-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--action-primary);
      margin: 0 3px;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .loader-dot:nth-child(1) { animation-delay: -0.32s; }
    .loader-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* === Sort bar === */
    .sort-bar {
      display: flex;
      gap: 4px;
      padding: 8px 16px;
      overflow-x: auto;
      border-bottom: 1px solid var(--border-card);
      scrollbar-width: none;
    }
    .sort-bar::-webkit-scrollbar { display: none; }
    .sort-btn {
      padding: 5px 10px;
      background: transparent;
      border: 1px solid var(--border-card);
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .sort-btn:hover { background: rgba(255, 255, 255, 0.05); }
    .sort-btn.active {
      background: var(--action-primary);
      border-color: var(--action-primary);
      color: var(--text-primary);
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="app-header">
      <div class="app-title">
        <strong>WebSales</strong> · Система пошуку акцій
      </div>
      <div class="app-subtitle">Сільпо · Новус · Фора — усі знижки в одному місці</div>

      <button class="filter-toggle" id="filterToggle" type="button">▼ Фільтри</button>

      <div class="filters" id="filters">
        <div class="filter-row">
          <span class="filter-chip active" data-store="silpo" id="chipSilpo">
            <span class="filter-chip-dot"></span>Сільпо
          </span>
          <span class="filter-chip active" data-store="novus" id="chipNovus">
            <span class="filter-chip-dot"></span>Новус
          </span>
          <span class="filter-chip active" data-store="fora" id="chipFora">
            <span class="filter-chip-dot"></span>Фора
          </span>
        </div>

        <div class="filter-row">
          <input type="text" class="filter-input" id="searchInput" placeholder="🔍 Пошук товару..." />
        </div>

        <div class="filter-row">
          <div class="filter-range">
            <input type="number" class="filter-input" id="discountMin" placeholder="Знижка від %" min="0" max="100" step="1" value="35" style="max-width: 110px" />
            <span class="filter-range-sep">—</span>
            <input type="number" class="filter-input" id="discountMax" placeholder="до %" min="0" max="100" step="1" value="60" style="max-width: 110px" />
          </div>
        </div>

        <div class="filter-row">
          <button class="btn-primary" id="btnFind" type="button">Знайти товари</button>
        </div>
      </div>
    </header>

    <div class="status-bar">
      <span>Знайдено: <strong id="count">0</strong> товарів</span>
      <span id="statusInfo">Моноліт готовий</span>
    </div>

    <div class="sort-bar">
      <button class="sort-btn active" data-sort="discount-desc" type="button">↓ Знижка</button>
      <button class="sort-btn" data-sort="price-asc" type="button">↑ Ціна</button>
      <button class="sort-btn" data-sort="price-desc" type="button">↓ Ціна</button>
      <button class="sort-btn" data-sort="name" type="button">А–Я</button>
    </div>

    <main class="products" id="products"></main>
  </div>

  <script>
    const STORE_LABELS = { silpo: 'Сільпо', novus: 'Новус', fora: 'Фора' };
    const STORE_EMOJI = { silpo: '🌲', novus: '🟡', fora: '⚓' };

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

    function toggleFilters() {
      filtersEl.classList.toggle('collapsed');
      const isCollapsed = filtersEl.classList.contains('collapsed');
      filterToggleEl.textContent = isCollapsed ? '▶ Фільтри' : '▼ Фільтри';
    }

    function toggleStore(key) {
      state.activeStores[key] = !state.activeStores[key];
      const chip = chipEls[key];
      if (chip) chip.classList.toggle('active', state.activeStores[key]);
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

      state.displayProducts = state.allProducts.filter(function(p) {
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
      const duplicateCount = Math.max(0, state.lastRawCount - state.allProducts.length);
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
      const storeKey = (p.store || '').toLowerCase().replace('і', 'i');
      const storeEmoji = STORE_EMOJI[storeKey] || '•';
      const oldPriceHtml = p.oldPrice && toNumber(p.oldPrice) > 0
        ? '<span class="price-old">' + esc(formatPrice(p.oldPrice)) + '</span>'
        : '';
      const discountHtml = discount !== null
        ? '<span class="product-discount ' + discountClass + '">−' + discount + '%</span>'
        : '';
      const imageHtml = p.image
        ? '<img class="product-image" src="' + esc(p.image) + '" loading="lazy" alt="" />'
        : '<div class="product-image-placeholder">📦</div>';
      const linkHtml = p.url
        ? '<a class="product-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">Відкрити в магазині →</a>'
        : '';

      return '<article class="product-card" data-store="' + esc(p.store) + '">' +
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
      return '<div class="empty-state">' +
        '<div class="empty-state-icon">🎯</div>' +
        '<div class="empty-state-title">Немає товарів за вашим запитом</div>' +
        '<div class="empty-state-sub">Спробуйте змінити фільтри або скинути пошук</div>' +
      '</div>';
    }

    filterToggleEl.addEventListener('click', toggleFilters);
    chipEls.silpo.addEventListener('click', function() { toggleStore('silpo'); });
    chipEls.novus.addEventListener('click', function() { toggleStore('novus'); });
    chipEls.fora.addEventListener('click',  function() { toggleStore('fora'); });
    searchInput.addEventListener('input', onSearch);
    discountMinInput.addEventListener('input', onDiscountMin);
    discountMaxInput.addEventListener('input', onDiscountMax);
    btnFind.addEventListener('click', loadProducts);
    sortButtons.forEach(function(btn) {
      btn.addEventListener('click', function() { sort(btn.dataset.sort); });
    });

    if (window.matchMedia('(max-width: 420px)').matches) {
      filtersEl.classList.add('collapsed');
      filterToggleEl.textContent = '▶ Фільтри';
    }
  </script>
</body>
</html>`;
