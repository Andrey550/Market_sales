export const STYLES = `
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
    .filter-input-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .filter-hint {
      font-size: 10px;
      color: var(--text-muted);
      flex-basis: 100%;
      letter-spacing: 0.03em;
    }

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
    .product-card[data-store="silpo"] { border-left: 3px solid var(--store-silpo); }
    .product-card[data-store="novus"] { border-left: 3px solid var(--store-novus); }
    .product-card[data-store="fora"]  { border-left: 3px solid var(--store-fora); }

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
`;
