# WebSales

WebSales is a Cloudflare Worker application for viewing promotional products from three grocery chains in one interface:

- Silpo
- Novus
- Fora

The app serves a single HTML page and several API endpoints that normalize store data into one shared format for the frontend.

## Features

- Loading categories from multiple stores
- Loading products for one or many selected categories
- Combined product table with search, sorting, discount filter, and price range filtering
- Deduplication of products by stable store-specific identifier
- One deployment target through Cloudflare Workers

## Stack

- JavaScript (ES modules)
- Cloudflare Workers
- Wrangler
- External store APIs: Silpo, Novus, Fora

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Wrangler will start a local Worker preview.

### 3. Run a pre-release check

```bash
npm run check
```

This command validates JavaScript syntax for the Worker entrypoint, provider modules, utilities, and the embedded frontend page.

### 4. Deploy

```bash
npm run deploy
```

## Project Structure

```text
src/
  index.js          Worker entrypoint and route handling
  page.js           HTML/CSS/JS for the client UI
  catalog-utils.js  Category flattening and product merge helpers
  silpo.js          Silpo provider integration
  novus.js          Novus provider integration
  fora.js           Fora provider integration
wrangler.toml       Cloudflare Worker configuration
```

## API Endpoints

- `GET /api/silpo/categories`
- `GET /api/silpo/products?category=<id[,id]>`
- `GET /api/novus/categories`
- `GET /api/novus/products?category=<id[,id]>`
- `GET /api/fora/categories`
- `GET /api/fora/products?category=<id[,id]>`
- `GET /` or `GET /index.html`

All product endpoints return a normalized payload:

```json
{
  "total": 0,
  "rawTotal": 0,
  "products": [],
  "errors": []
}
```

`errors` is included when one or more category requests fail but the overall response can still be returned.

## Release Notes

The current release prep includes:

- developer comments in critical code paths
- safer method handling for the Worker
- basic response hardening headers for the HTML page
- nested category lookup fixes for Silpo and Fora so child category labels are preserved
- GitHub-ready documentation and ignore rules

## Notes for Future Development

- The UI is embedded directly in `src/page.js`, so frontend changes do not require a separate bundler.
- Store APIs are external and may change without notice; if a provider breaks, start debugging in its dedicated module.
- If the project grows, the first worthwhile refactor is splitting the client script out of `src/page.js` into smaller modules.
