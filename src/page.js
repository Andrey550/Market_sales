import { STYLES } from './client/styles.js';
import { PAGE_BODY } from './client/page-body.js';
import { CLIENT_SCRIPT } from './client/script.js';

export const HTML_PAGE = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSales · Система пошуку акцій</title>
  <style>${STYLES}</style>
</head>
<body>${PAGE_BODY}
  <script>${CLIENT_SCRIPT}</script>
</body>
</html>`;
