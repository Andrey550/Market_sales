export const HTML_PAGE = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSales - Парсер продуктів</title>
  <style>
    :root {
      color-scheme: light;
      --bg-page: #F7F8FA;
      --bg-page-accent: radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 32%);
      --bg-panel: rgba(255,255,255,0.9);
      --bg-card: #FFFFFF;
      --bg-card-secondary: #F1F3F5;
      --bg-card-hover: #F9FAFB;
      --text-main: #1F2933;
      --text-secondary: #6B7280;
      --text-muted: #9CA3AF;
      --accent-primary: #3B82F6;
      --accent-primary-hover: #2563EB;
      --accent-success: #22C55E;
      --accent-warning: #F59E0B;
      --accent-error: #EF4444;
      --divider: #E2E5E9;
      --divider-strong: #D1D5DB;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.07);
      --shadow-lg: 0 10px 30px rgba(0,0,0,0.08);
      --btn-shadow: 0 6px 16px rgba(59,130,246,0.18);
      --focus-ring: rgba(59,130,246,0.15);

      --font-size-sm: 12px;
      --font-size-base: 14px;
      --font-size-md: 16px;
      --font-size-lg: 18px;

      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 12px;
      --radius-xl: 20px;
      --radius-pill: 999px;

      --duration-fast: 120ms;
      --duration-normal: 160ms;
      --duration-slow: 240ms;
      --easing-out: cubic-bezier(.22,.9,.35,1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg-page-accent), var(--bg-page);
      color: var(--text-main);
      font-size: var(--font-size-base);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }

    h1 {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.2;
      color: var(--text-main);
      margin-right: 16px;
      white-space: nowrap;
      letter-spacing: -0.02em;
    }

    /* === Header & Panels === */
    .header {
      background-color: var(--bg-panel);
      backdrop-filter: blur(12px);
      padding: 20px 24px;
      border: 1px solid rgba(255,255,255,0.72);
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: sticky;
      top: 20px;
      z-index: 100;
      box-shadow: var(--shadow-md);
    }

    .header__top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .header__toggle {
      display: none;
      margin-left: auto;
      padding: 10px 14px;
    }

    .header__toggle-icon {
      width: 16px;
      height: 16px;
      transition: transform var(--duration-normal) var(--easing-out);
    }

    .header__controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      flex: 1;
    }

    .header__search {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      padding: 6px;
      background: var(--bg-card-secondary);
      border: 1px solid var(--divider);
      border-radius: 14px;
    }

    .filters-panel {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      padding: 16px 18px;
      background: var(--bg-card-secondary);
      border: 1px solid var(--divider);
      border-radius: 16px;
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: var(--font-size-base);
      color: var(--text-main);
    }
    .filter-item label {
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    /* === Inputs & Selects === */
    .input {
      background-color: var(--bg-card);
      border: 1px solid var(--divider-strong);
      border-radius: 8px;
      padding: 10px 12px;
      color: var(--text-main);
      font-family: inherit;
      font-size: var(--font-size-base);
      outline: none;
      transition: border-color var(--duration-normal) var(--easing-out), box-shadow var(--duration-normal) var(--easing-out), background-color var(--duration-normal) var(--easing-out);
      min-width: 160px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .input::placeholder {
      color: var(--text-secondary);
    }
    .input:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--focus-ring);
    }

    input[type="range"] {
      cursor: pointer;
      accent-color: var(--accent-primary);
    }

    /* === Buttons === */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      outline: none;
      border-radius: 8px;
      padding: 10px 16px;
      font-family: inherit;
      font-size: var(--font-size-base);
      font-weight: 500;
      cursor: pointer;
      transition: background-color 150ms var(--easing-out), transform 150ms var(--easing-out), box-shadow 160ms var(--easing-out), color 150ms var(--easing-out), border-color 150ms var(--easing-out);
      white-space: nowrap;
      gap: 8px;
    }
    .btn:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .btn--primary {
      background-color: var(--accent-primary);
      color: #fff;
      box-shadow: var(--shadow-sm);
    }
    .btn--primary:hover {
      background-color: var(--accent-primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--btn-shadow);
    }
    .btn--primary:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    .btn--secondary {
      background-color: var(--bg-card-secondary);
      border: 1px solid var(--divider);
      color: var(--text-main);
      box-shadow: var(--shadow-sm);
    }
    .btn--secondary:hover {
      background-color: #E8EBEF;
    }
    .btn--secondary:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    .btn--ghost {
      background-color: transparent;
      color: var(--accent-primary);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-weight: 500;
    }
    .btn--ghost:hover {
      text-decoration: none;
      background-color: rgba(59,130,246,0.08);
    }
    .btn--ghost:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    /* === Multiselect Dropdowns === */
    .multiselect {
      position: relative;
      min-width: 200px;
      max-width: 320px;
    }
    .multiselect-btn {
      width: 100%;
      text-align: left;
      background-color: var(--bg-card);
      color: var(--text-main);
      border: 1px solid var(--divider-strong);
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: border-color var(--duration-normal) var(--easing-out), box-shadow var(--duration-normal) var(--easing-out), background-color var(--duration-normal) var(--easing-out);
      white-space: nowrap;
      overflow: hidden;
      font-size: var(--font-size-base);
      font-weight: 400;
      box-shadow: var(--shadow-sm);
    }
    .multiselect-btn:disabled {
      color: var(--text-muted);
      cursor: not-allowed;
      background-color: var(--bg-card-secondary);
    }
    .multiselect-btn:focus-visible, .multiselect.open .multiselect-btn {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--focus-ring);
    }
    .multiselect-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background-color: var(--bg-card);
      border: 1px solid var(--divider);
      border-radius: var(--radius-lg);
      max-height: 320px;
      overflow-y: auto;
      display: none;
      z-index: 100;
      box-shadow: var(--shadow-lg);
    }
    .multiselect.open .multiselect-dropdown {
      display: block;
      animation: dropdownOpen var(--duration-fast) var(--easing-out);
    }
    @keyframes dropdownOpen {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-search {
      padding: 8px;
      position: sticky;
      top: 0;
      background-color: var(--bg-card);
      z-index: 2;
      border-bottom: 1px solid var(--divider);
    }
    .dropdown-search .input {
      width: 100%;
      min-width: 0;
      padding: 8px 10px;
      font-size: 13px;
    }
    .store-header {
      padding: 8px 12px;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--divider);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .checkbox-pill.select-all-row {
      font-weight: 600;
      color: var(--text-main);
      border-bottom: 1px solid var(--divider);
      background-color: var(--bg-card-secondary);
    }
    .checkbox-pill.select-all-row:hover {
      background-color: var(--bg-card-hover);
    }

    /* === Checkboxes === */
    .checkbox-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color var(--duration-fast) var(--easing-out);
      color: var(--text-main);
      font-size: var(--font-size-base);
    }
    .checkbox-pill:hover {
      background-color: var(--bg-card-hover);
    }
    .checkbox-pill input,
    .checkbox-square {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      min-width: 18px;
      border-radius: 6px;
      background-color: var(--bg-card);
      border: 2px solid var(--divider-strong);
      cursor: pointer;
      position: relative;
      transition: all 180ms ease;
      display: grid;
      place-content: center;
      margin: 0;
    }
    .checkbox-pill input:hover,
    .checkbox-square:hover {
      border-color: var(--accent-primary);
    }
    .checkbox-pill input::before,
    .checkbox-square::before {
      content: "";
      width: 10px;
      height: 10px;
      background-color: white;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transition: transform 180ms var(--easing-out);
    }
    .checkbox-pill input:checked,
    .checkbox-square:checked {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .checkbox-pill input:checked::before,
    .checkbox-square:checked::before {
      transform: scale(1);
    }
    .checkbox-pill input:focus-visible,
    .checkbox-square:focus-visible {
      box-shadow: 0 0 0 3px var(--focus-ring);
    }
    .checkbox-pill input:disabled,
    .checkbox-square:disabled {
      background-color: var(--bg-card-secondary);
      border-color: var(--divider);
    }
    .checkbox-pill input:disabled::before,
    .checkbox-square:disabled::before {
      background-color: var(--text-muted);
    }

    /* === Table === */
    .table-wrap {
      flex: 1;
      padding: 20px 0 0;
      overflow-x: auto;
      background: var(--bg-card);
      border: 1px solid var(--divider);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      margin-top: 20px;
    }
    .table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 13px;
      margin: 0;
    }
    .table th, .table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--divider);
      vertical-align: middle;
    }
    .table th {
      background-color: var(--bg-page);
      color: #374151;
      font-weight: 500;
      position: sticky;
      top: 0;
      z-index: 10;
      cursor: pointer;
      user-select: none;
      transition: background-color var(--duration-fast);
      white-space: nowrap;
    }
    .table th:hover {
      background-color: var(--bg-card-secondary);
    }
    .table th:first-child {
      border-top-left-radius: var(--radius-md);
    }
    .table th:last-child {
      border-top-right-radius: var(--radius-md);
    }

    .sort-icon {
      width: 16px;
      height: 16px;
      margin-left: 6px;
      stroke: currentColor;
      opacity: 0.3;
      transition: opacity 0.2s, transform 0.2s;
      vertical-align: text-bottom;
      display: inline-block;
    }
    .table th.sorted .sort-icon {
      opacity: 1;
      color: var(--accent-primary);
    }
    .table th.sorted.asc .sort-icon {
      transform: rotate(180deg);
    }

    .table tbody tr {
      background-color: transparent;
      transition: background-color var(--duration-fast);
    }
    .table tbody tr:hover {
      background-color: var(--bg-card-hover);
    }
    .table tbody tr.selected {
      background-color: rgba(59,130,246,0.08);
      position: relative;
    }
    .table tbody tr.selected td:first-child::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--accent-primary);
    }

    .table td.price {
      color: var(--accent-success);
      font-weight: 600;
      white-space: nowrap;
      text-align: right;
    }
    .table td.old-price {
      color: var(--text-muted);
      text-decoration: line-through;
      white-space: nowrap;
      text-align: right;
    }
    .table td.discount {
      font-weight: 600;
      white-space: nowrap;
      text-align: right;
    }
    .table td.discount.has {
      color: var(--accent-success);
    }
    .table th.col-right, .table td.col-right {
      text-align: right;
    }

    /* === Badges === */
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      font-size: var(--font-size-sm);
      font-weight: 600;
      white-space: nowrap;
    }
    .badge--silpo {
      background-color: rgba(34,197,94,0.12);
      color: var(--accent-success);
    }
    .badge--novus {
      background-color: rgba(59,130,246,0.12);
      color: var(--accent-primary);
    }
    .badge--fora {
      background-color: rgba(245,158,11,0.14);
      color: #D97706;
    }

    /* === Status Bar === */
    .status-bar {
      padding: 14px 20px;
      background-color: var(--bg-card);
      color: var(--text-secondary);
      font-size: 13px;
      border: 1px solid var(--divider);
      border-radius: 16px;
      text-align: center;
      margin-top: 16px;
      box-shadow: var(--shadow-sm);
    }

    .loader {
      display: none;
      padding: 40px 24px 20px;
      text-align: center;
      color: var(--accent-primary);
      font-size: var(--font-size-md);
      font-weight: 500;
    }
    .loader.active {
      display: block;
    }

    /* === Responsive (Mobile Cards) === */
    @media (max-width: 992px) {
      body { padding: 16px; }
      .header { padding: 16px; top: 16px; }
      .table-wrap { padding-top: 16px; }
    }

    @media (max-width: 768px) {
      .header { gap: 12px; }
      .header__top { align-items: flex-start; }
      .header__toggle { display: inline-flex; align-self: flex-start; }
      .header__search,
      .filters-panel { width: 100%; }
      .header--collapsed .header__controls,
      .header--collapsed .header__search,
      .header--collapsed .filters-panel { display: none; }
      .header--collapsed .header__toggle-icon { transform: rotate(-180deg); }
      .header__controls { flex-direction: column; align-items: stretch; }
      .multiselect { max-width: 100%; }
      .header__search { margin-left: 0; width: 100%; }
      .header__search input { flex: 1; }
      .filters-panel { gap: 12px; }
      .filter-item input[type="range"] { width: 100px; }

      .table, .table tbody, .table tr, .table td {
        display: block;
        width: 100%; }
      .table thead {
        display: none;
      }
      .table tr {
        background-color: var(--bg-card);
        border: 1px solid var(--divider);
        border-radius: var(--radius-lg);
        margin-bottom: 12px;
        padding: 12px;
        box-shadow: var(--shadow-sm);
      }
      .table tr.selected {
        border-color: var(--accent-primary);
      }
      .table tr.selected td:first-child::before {
        display: none;
      }
      .table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider);
        text-align: left;
      }
      .table td:last-child {
        border-bottom: none;
      }
      .table td::before {
        content: attr(data-label);
        color: var(--text-secondary);
        font-weight: 500;
        margin-right: 16px;
      }
      .table td > :last-child {
        text-align: right;
      }

      .table td.product-name {
        flex-direction: column;
        align-items: flex-start;
        font-size: 16px;
        font-weight: bold;
      }
      .table td.product-name::before {
        margin-bottom: 4px;
      }
      .table td.col-right {
        text-align: left;
      }
      .table td.price, .table td.old-price, .table td.discount {
        text-align: right;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header__top">
      <h1>WebSales</h1>
      <button
        id="headerToggle"
        class="btn btn--secondary header__toggle"
        type="button"
        aria-expanded="true"
        aria-controls="headerControls headerSearch headerFilters"
      >
        <span id="headerToggleLabel">Показати</span>
        <svg class="header__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div id="headerControls" class="header__controls">
        <div class="multiselect">
          <button id="storeBtn" class="btn btn--secondary multiselect-btn">
            <span>-- Магазини --</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div id="storeDropdown" class="multiselect-dropdown">
            <label class="checkbox-pill">
              <input type="checkbox" value="silpo"><span>Сільпо</span>
            </label>
            <label class="checkbox-pill">
              <input type="checkbox" value="novus"><span>Новус</span>
            </label>
            <label class="checkbox-pill">
              <input type="checkbox" value="fora"><span>Фора</span>
            </label>
          </div>
        </div>
        
        <div class="multiselect">
          <button id="categoryBtn" class="btn btn--secondary multiselect-btn" disabled>
            <span>-- Категорії --</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div id="categoryDropdown" class="multiselect-dropdown">
            <div class="dropdown-search">
              <input type="text" id="categorySearch" class="input" placeholder="Пошук категорії..." />
            </div>
            <div id="categoryList">
              <!-- Р§РµРєР±РѕРєСЃС‹ РєР°С‚РµРіРѕСЂРёР№ Р±СѓРґСѓС‚ Р·РґРµСЃСЊ С‚РѕР¶Рµ checkbox-pill -->
            </div>
          </div>
        </div>

        <button id="btnFind" class="btn btn--primary" disabled>Знайти товари</button>
      </div>

      <div id="headerSearch" class="header__search">
        <input type="text" id="searchInput" class="input" placeholder="Пошук товару..." />
        <button id="btnSearch" class="btn btn--secondary">Пошук</button>
      </div>
    </div>

    <div id="headerFilters" class="filters-panel">
      <div class="filter-item">
        <label for="minDiscount">Від: <span id="minDiscountVal">35</span>%</label>
        <input type="range" id="minDiscount" min="0" max="100" step="1" value="35" />
      </div>
      <div class="filter-item">
        <label for="maxDiscount">До: <span id="maxDiscountVal">60</span>%</label>
        <input type="range" id="maxDiscount" min="0" max="100" step="1" value="60" />
      </div>
    </div>
  </div>

  <div class="loader" id="loader">Завантаження...</div>

  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th data-key="store">Магазин <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th data-key="name">Назва продукту <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th data-key="category">Категорія <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th data-key="unit">Одиниця <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th data-key="price" class="col-right">Ціна <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th data-key="oldPrice" class="col-right">Стара ціна <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th data-key="discount" class="col-right">Знижка <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></th>
          <th>Дія</th>
        </tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  </div>

  <div class="status-bar" id="statusBar">Оберіть магазин та категорію.</div>

  <script>
    // The Worker serves this page as a static HTML string, so all browser-side
    // state management lives inside this embedded script.
    const header = document.querySelector('.header');
    const headerControls = document.getElementById('headerControls');
    const headerSearch = document.getElementById('headerSearch');
    const headerFilters = document.getElementById('headerFilters');
    const headerToggle = document.getElementById('headerToggle');
    const headerToggleLabel = document.getElementById('headerToggleLabel');
    const storeBtn = document.getElementById('storeBtn');
    const storeDropdown = document.getElementById('storeDropdown');
    const categoryBtn = document.getElementById('categoryBtn');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categorySearch = document.getElementById('categorySearch');
    const categoryList = document.getElementById('categoryList');
    const btnFind = document.getElementById('btnFind');
    const searchInput = document.getElementById('searchInput');
    const btnSearch = document.getElementById('btnSearch');
    const minDiscountInput = document.getElementById('minDiscount');
    const minDiscountVal = document.getElementById('minDiscountVal');
    const maxDiscountInput = document.getElementById('maxDiscount');
    const maxDiscountVal = document.getElementById('maxDiscountVal');
    const tableBody = document.getElementById('tableBody');
    const statusBar = document.getElementById('statusBar');
    const loader = document.getElementById('loader');

    const STORE_LABELS = {
      silpo: 'Сільпо',
      novus: 'Новус',
      fora: 'Фора'
    };

    // allProducts keeps the merged API payload, while displayProducts holds
    // the current filtered and sorted slice rendered in the table.
    let allProducts = [];
    let displayProducts = [];
    let currentSort = { key: null, dir: 1 };
    // Incrementing request ids lets us ignore stale category responses when
    // the user quickly changes the selected stores.
    let currentCategoryFetchId = 0;
    let lastRawProductCount = 0;
    let lastLoadErrors = [];

    function syncHeaderCollapsedState() {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      if (!isMobile) {
        header.classList.remove('header--collapsed');
      }

      const isCollapsed = isMobile && header.classList.contains('header--collapsed');
      headerToggleLabel.textContent = isCollapsed ? '\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438' : '\u0421\u0445\u043e\u0432\u0430\u0442\u0438';
      headerToggle.setAttribute('aria-expanded', String(!isCollapsed));
      headerControls.hidden = isCollapsed;
      headerSearch.hidden = isCollapsed;
      headerFilters.hidden = isCollapsed;
    }

    headerToggle.addEventListener('click', function() {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        return;
      }

      header.classList.toggle('header--collapsed');
      syncHeaderCollapsedState();
    });

    window.addEventListener('resize', syncHeaderCollapsedState);
    syncHeaderCollapsedState();

    storeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!storeBtn.disabled) {
        storeBtn.closest('.multiselect').classList.toggle('open');
      }
    });

    categoryBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!categoryBtn.disabled) {
        categoryBtn.closest('.multiselect').classList.toggle('open');
      }
    });

    document.addEventListener('click', function(e) {
      if (!storeBtn.contains(e.target) && !storeDropdown.contains(e.target)) {
        storeBtn.closest('.multiselect').classList.remove('open');
      }
      if (!categoryBtn.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryBtn.closest('.multiselect').classList.remove('open');
      }
    });

    categorySearch.addEventListener('input', function(e) {
      const query = safeLower(e.target.value);
      let currentHeader = null;
      let headerHasVisibleCategories = false;

      Array.from(categoryList.children).forEach(function(element) {
        if (element.classList.contains('select-all-row')) {
          return;
        }
        if (element.classList.contains('store-header')) {
          if (currentHeader) {
            currentHeader.style.display = headerHasVisibleCategories ? 'block' : 'none';
          }
          currentHeader = element;
          headerHasVisibleCategories = false;
          return;
        }

        if (!element.classList.contains('checkbox-pill')) {
          return;
        }

        const text = safeLower(element.textContent);
        const isVisible = !query || text.includes(query);
        element.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) {
          headerHasVisibleCategories = true;
        }
      });

      if (currentHeader) {
        currentHeader.style.display = headerHasVisibleCategories ? 'block' : 'none';
      }
      updateSelectAllState();
    });

    categorySearch.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    storeDropdown.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', updateStoreButtonText);
    });

    document.querySelectorAll('.table thead th[data-key]').forEach(function(th) {
      th.addEventListener('click', function() {
        const key = th.dataset.key;
        if (!key || key === 'checked') {
          return;
        }

        if (currentSort.key === key) {
          currentSort.dir *= -1;
        } else {
          currentSort.key = key;
          currentSort.dir = key === 'discount' ? -1 : 1;
        }

        document.querySelectorAll('.table thead th').forEach(function(header) {
          header.classList.remove('sorted', 'asc', 'desc');
        });
        th.classList.add('sorted');
        th.classList.add(currentSort.dir === 1 ? 'asc' : 'desc');

        sortAndRender();
      });
    });

    btnFind.addEventListener('click', loadProducts);
    btnSearch.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        doSearch();
      }
    });
    minDiscountInput.addEventListener('input', function() {
      if (toNumber(minDiscountInput.value) > toNumber(maxDiscountInput.value)) {
        maxDiscountInput.value = minDiscountInput.value;
      }
      updateDiscountLabels();
      doSearch();
    });
    maxDiscountInput.addEventListener('input', function() {
      if (toNumber(maxDiscountInput.value) < toNumber(minDiscountInput.value)) {
        minDiscountInput.value = maxDiscountInput.value;
      }
      updateDiscountLabels();
      doSearch();
    });

    resetDiscountRange([]);
    updateStoreButtonText();
    updateCategoryButtonText();

    function safeLower(value) {
      return String(value || '').toLowerCase();
    }

    function toNumber(value) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : 0;
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

    function updateDiscountLabels() {
      minDiscountVal.textContent = minDiscountInput.value;
      maxDiscountVal.textContent = maxDiscountInput.value;
    }

    function resetDiscountRange(products) {
      minDiscountInput.value = '35';
      maxDiscountInput.value = '60';
      updateDiscountLabels();
    }

    function hasActiveFilters() {
      return !!searchInput.value.trim() || toNumber(minDiscountInput.value) > 0 || toNumber(maxDiscountInput.value) < 100;
    }

    function updateStatusBar() {
      const duplicateCount = Math.max(0, lastRawProductCount - allProducts.length);
      const duplicateNote = duplicateCount > 0 ? ' Без дублікатів: ' + duplicateCount + '.' : '';
      const errorNote = lastLoadErrors.length > 0 ? ' Помилки: ' + lastLoadErrors.join(' | ') : '';

      if (allProducts.length === 0) {
        statusBar.textContent = lastLoadErrors.length > 0 ? 'Не вдалося завантажити товари. ' + lastLoadErrors.join(' | ') : 'Товари не завантажені.';
        return;
      }

      if (hasActiveFilters()) {
        statusBar.textContent = 'Показано ' + displayProducts.length + ' з ' + allProducts.length + ' товарів.' + duplicateNote + errorNote;
        return;
      }

      statusBar.textContent = 'Завантажено ' + allProducts.length + ' товарів.' + duplicateNote + errorNote;
    }

    function updateStoreButtonText() {
      const checkedBoxes = Array.from(storeDropdown.querySelectorAll('input[type="checkbox"]:checked'));
      const buttonText = storeBtn.querySelector('span:first-child');

      if (checkedBoxes.length === 0) {
        buttonText.textContent = '-- Магазини --';
      } else if (checkedBoxes.length === 1) {
        buttonText.textContent = checkedBoxes[0].nextElementSibling.textContent;
      } else {
        buttonText.textContent = 'Обрано: ' + checkedBoxes.length;
      }

      loadCategoriesForStores(checkedBoxes.map(function(checkbox) {
        return checkbox.value;
      }));
    }

    function getSelectedStores() {
      return Array.from(storeDropdown.querySelectorAll('input[type="checkbox"]:checked')).map(function(checkbox) {
        return checkbox.value;
      });
    }

    function updateCategoryButtonText() {
      const checkedBoxes = Array.from(categoryDropdown.querySelectorAll('input[type="checkbox"]:checked'));
      const buttonText = categoryBtn.querySelector('span:first-child');

      if (checkedBoxes.length === 0) {
        buttonText.textContent = '-- Категорії --';
        btnFind.disabled = true;
      } else if (checkedBoxes.length === 1) {
        buttonText.textContent = checkedBoxes[0].nextElementSibling.textContent;
        btnFind.disabled = false;
      } else {
        buttonText.textContent = 'Обрано: ' + checkedBoxes.length;
        btnFind.disabled = false;
      }

      if (categoryBtn.disabled) {
        btnFind.disabled = true;
      }
      updateSelectAllState();
    }

    function getSelectedCategories() {
      return Array.from(categoryList.querySelectorAll('.checkbox-pill:not(.select-all-row) input:checked')).map(function(checkbox) {
        return checkbox.value;
      });
    }

    function getVisibleCategoryCheckboxes() {
      return Array.from(categoryList.querySelectorAll('.checkbox-pill:not(.select-all-row)'))
        .filter(function(label) { return label.style.display !== 'none'; })
        .map(function(label) { return label.querySelector('input'); });
    }

    function updateSelectAllState() {
      const masterCb = categoryList.querySelector('.select-all-row input');
      if (!masterCb) return;
      const visible = getVisibleCategoryCheckboxes();
      const checkedCount = visible.filter(function(cb) { return cb.checked; }).length;
      if (visible.length === 0 || checkedCount === 0) {
        masterCb.checked = false;
        masterCb.indeterminate = false;
      } else if (checkedCount === visible.length) {
        masterCb.checked = true;
        masterCb.indeterminate = false;
      } else {
        masterCb.checked = false;
        masterCb.indeterminate = true;
      }
    }

    function sortAndRender() {
      const key = currentSort.key;
      const dir = currentSort.dir;

      if (!key) {
        renderProducts(displayProducts);
        return;
      }

      displayProducts.sort(function(a, b) {
        let valueA = a[key];
        let valueB = b[key];

        if (key === 'discount') {
          valueA = valueA != null ? Math.abs(toNumber(valueA)) : null;
          valueB = valueB != null ? Math.abs(toNumber(valueB)) : null;
        }

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return 1;
        if (valueB == null) return -1;

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return (valueA - valueB) * dir;
        }

        return String(valueA).localeCompare(String(valueB), 'uk') * dir;
      });

      renderProducts(displayProducts);
    }

    async function loadCategoriesForStores(stores) {
      // Categories are loaded in parallel per store, but rendered in grouped
      // sections so users can still see where each option came from.
      const fetchId = ++currentCategoryFetchId;

      categoryList.innerHTML = '';
      categorySearch.value = '';
      categoryBtn.querySelector('span:first-child').textContent = '-- Категорії --';
      categoryBtn.disabled = true;
      btnFind.disabled = true;
      allProducts = [];
      displayProducts = [];
      lastRawProductCount = 0;
      lastLoadErrors = [];
      tableBody.innerHTML = '';
      resetDiscountRange([]);

      const selectAllLabel = document.createElement('label');
      selectAllLabel.className = 'checkbox-pill select-all-row';
      const selectAllCb = document.createElement('input');
      selectAllCb.type = 'checkbox';
      const selectAllSpan = document.createElement('span');
      selectAllSpan.textContent = 'Обрати всі';
      selectAllLabel.appendChild(selectAllCb);
      selectAllLabel.appendChild(selectAllSpan);
      selectAllCb.addEventListener('change', function() {
        const visible = getVisibleCategoryCheckboxes();
        visible.forEach(function(cb) { cb.checked = selectAllCb.checked; });
        updateCategoryButtonText();
      });
      categoryList.appendChild(selectAllLabel);
      if (!stores || stores.length === 0) {
        statusBar.textContent = 'Оберіть магазин(и) та категорію(ї).';
        return;
      }

      loader.classList.add('active');
      statusBar.textContent = 'Завантаження категорій...';

      try {
        const settlements = await Promise.allSettled(stores.map(async function(store) {
          const resp = await fetch('/api/' + store + '/categories');
          const data = await readJsonResponse(resp, 'Не вдалося завантажити категорії для магазину ' + (STORE_LABELS[store] || store) + '.');
          return {
            store: store,
            categories: Array.isArray(data) ? data : []
          };
        }));

        if (fetchId !== currentCategoryFetchId) {
          return;
        }

        let totalCategories = 0;
        const errors = [];

        settlements.forEach(function(settlement, index) {
          const store = stores[index];
          const storeLabel = STORE_LABELS[store] || store;

          if (settlement.status !== 'fulfilled') {
            errors.push(storeLabel + ': ' + (settlement.reason && settlement.reason.message ? settlement.reason.message : 'Невідома помилка.'));
            return;
          }

          const categories = settlement.value.categories.filter(function(category) {
            return (category && category.count) !== 0;
          });

          if (categories.length === 0) {
            return;
          }

          const storeHeader = document.createElement('div');
          storeHeader.className = 'store-header';
          storeHeader.textContent = storeLabel;
          categoryList.appendChild(storeHeader);

          categories.forEach(function(category) {
            totalCategories += 1;

            const label = document.createElement('label');
            label.className = 'checkbox-pill';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = store + ':' + category.id;
            checkbox.addEventListener('change', updateCategoryButtonText);

            const textSpan = document.createElement('span');
            textSpan.textContent = category.title + (category.count ? ' (' + category.count + ')' : '');

            label.appendChild(checkbox);
            label.appendChild(textSpan);
            categoryList.appendChild(label);
          });
        });

        categoryBtn.disabled = totalCategories === 0;
        updateCategoryButtonText();

        if (totalCategories > 0) {
          statusBar.textContent = 'Категорії завантажені (' + totalCategories + '). Оберіть категорію.';
          if (errors.length > 0) {
            statusBar.textContent += ' Помилки: ' + errors.join(' | ');
          }
        } else if (errors.length > 0) {
          statusBar.textContent = 'Не вдалося завантажити категорії. ' + errors.join(' | ');
        } else {
          statusBar.textContent = 'Для обраних магазинів категорій не знайдено.';
        }
      } catch (error) {
        if (fetchId === currentCategoryFetchId) {
          statusBar.textContent = 'Помилка: ' + error.message;
        }
      } finally {
        if (fetchId === currentCategoryFetchId) {
          loader.classList.remove('active');
        }
      }
    }

    async function loadProducts() {
      // Product payloads are fetched store-by-store and merged client-side
      // because each upstream provider uses its own API contract.
      const stores = getSelectedStores();
      const categoriesParam = getSelectedCategories();

      if (stores.length === 0 || categoriesParam.length === 0) {
        return;
      }

      loader.classList.add('active');
      btnFind.disabled = true;
      storeBtn.disabled = true;
      categoryBtn.disabled = true;
      storeBtn.closest('.multiselect').classList.remove('open');
      categoryBtn.closest('.multiselect').classList.remove('open');
      statusBar.textContent = 'Завантаження товарів...';
      tableBody.innerHTML = '';
      allProducts = [];
      displayProducts = [];
      lastRawProductCount = 0;
      lastLoadErrors = [];
      try {
        const settlements = await Promise.allSettled(stores.map(async function(store) {
          const storeCategories = categoriesParam
            .filter(function(value) {
              return value.startsWith(store + ':');
            })
            .map(function(value) {
              return value.split(':')[1];
            })
            .join(',');

          if (!storeCategories) {
            return null;
          }

          const resp = await fetch('/api/' + store + '/products?category=' + encodeURIComponent(storeCategories));
          const data = await readJsonResponse(resp, 'Не вдалося завантажити товари для магазину ' + (STORE_LABELS[store] || store) + '.');

          return {
            store: store,
            data: data
          };
        }));

        const mergedProducts = [];
        const errors = [];
        let rawCount = 0;

        settlements.forEach(function(settlement, index) {
          const store = stores[index];
          const storeLabel = STORE_LABELS[store] || store;

          if (settlement.status !== 'fulfilled') {
            errors.push(storeLabel + ': ' + (settlement.reason && settlement.reason.message ? settlement.reason.message : 'Невідома помилка.'));
            return;
          }

          if (!settlement.value) {
            return;
          }

          const data = settlement.value.data || {};
          const products = Array.isArray(data.products) ? data.products : [];

          mergedProducts.push.apply(mergedProducts, products);
          rawCount += data.rawTotal || data.total || products.length;

          if (Array.isArray(data.errors) && data.errors.length > 0) {
            errors.push(storeLabel + ': ' + data.errors.join(', '));
          }
        });

        allProducts = mergedProducts;
        displayProducts = mergedProducts.slice();
        lastRawProductCount = rawCount || mergedProducts.length;
        lastLoadErrors = errors;
        resetDiscountRange(allProducts);

        currentSort = { key: 'discount', dir: -1 };
        document.querySelectorAll('.table thead th').forEach(function(header) {
          header.classList.remove('sorted', 'asc', 'desc');
        });
        const discountHeader = document.querySelector('.table thead th[data-key="discount"]');
        if (discountHeader) {
          discountHeader.classList.add('sorted', 'desc');
        }

        doSearch();
      } catch (error) {
        statusBar.textContent = 'Помилка: ' + error.message;
      } finally {
        loader.classList.remove('active');
        btnFind.disabled = false;
        storeBtn.disabled = false;
        categoryBtn.disabled = false;
        updateCategoryButtonText();
      }
    }

    function doSearch() {
      // Once products are loaded, filtering stays local so the UI remains
      // responsive while the user tweaks search and price controls.
      const query = safeLower(searchInput.value.trim());
      const minDiscount = toNumber(minDiscountInput.value);
      const maxDiscount = toNumber(maxDiscountInput.value);

      displayProducts = allProducts.filter(function(product) {
        const textMatch = !query || safeLower(product && product.name).includes(query) || safeLower(product && product.category).includes(query) || safeLower(product && product.store).includes(query);
        const discountValue = Math.abs(toNumber(product && product.discount));
        const discountMatch = discountValue >= minDiscount && discountValue <= maxDiscount;

        return textMatch && discountMatch;
      });

      sortAndRender();
      updateStatusBar();
    }

    function renderProducts(products) {
      tableBody.innerHTML = '';
      if (!products.length) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="8" style="text-align:center;color:#6B7280;">Нічого не знайдено за поточними фільтрами.</td>';
        tableBody.appendChild(emptyRow);
        return;
      }

      products.forEach(function(product) {
        const row = document.createElement('tr');
        const storeClass = product.store === 'Сільпо' ? 'silpo' : product.store === 'Фора' ? 'fora' : 'novus';
        const discountDisplay = product.discount != null ? Math.abs(toNumber(product.discount)) + '%' : '—';

        row.innerHTML =
          '<td data-label="Магазин"><span class="badge badge--' + storeClass + '">' + esc(product.store) + '</span></td>' +
          '<td data-label="Назва" class="product-name">' + esc(product.name) + '</td>' +
          '<td data-label="Категорія">' + esc(product.category) + '</td>' +
          '<td data-label="Одиниця">' + esc(product.unit) + '</td>' +
          '<td data-label="Ціна" class="price">' + formatPrice(product.price) + '</td>' +
          '<td data-label="Стара ціна" class="old-price col-right">' + (product.oldPrice ? formatPrice(product.oldPrice) : '—') + '</td>' +
          '<td data-label="Знижка" class="discount' + (product.discount != null ? ' has' : '') + ' col-right">' + discountDisplay + '</td>' +
          '<td data-label="Дія"><a class="btn btn--ghost" href="' + esc(product.url || '#') + '" target="_blank" rel="noopener">Відкрити</a></td>';

        tableBody.appendChild(row);
      });
    }

    function formatPrice(value) {
      if (value == null) {
        return '—';
      }
      return toNumber(value).toFixed(2) + ' ₴';
    }

    function esc(value) {
      if (value == null) {
        return '';
      }

      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  </script>
</body>
</html>`;

