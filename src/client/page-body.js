export const PAGE_BODY = `
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
            <label class="filter-input-label" for="discountMin">Від</label>
            <input type="number" class="filter-input" id="discountMin" placeholder="Знижка від %" min="0" max="100" step="1" value="35" style="max-width: 110px" aria-label="Мінімальна знижка, % (0 = без обмеження)" />
            <span class="filter-range-sep">—</span>
            <label class="filter-input-label" for="discountMax">До</label>
            <input type="number" class="filter-input" id="discountMax" placeholder="до %" min="0" max="100" step="1" value="60" style="max-width: 110px" aria-label="Максимальна знижка, % (0 = без обмеження)" />
          </div>
          <div class="filter-hint">0 = без обмеження</div>
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
`;
