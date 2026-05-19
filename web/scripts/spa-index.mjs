// Create index.html for SPA mode (ssr: false)
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', '.output', 'public');
const nuxtDir = join(publicDir, '_nuxt');
const indexPath = join(publicDir, 'index.html');

let cssLinks = '';
let jsScripts = '';

if (existsSync(nuxtDir)) {
  const files = readdirSync(nuxtDir);
  for (const f of files) {
    if (f.endsWith('.css')) {
      cssLinks += `  <link rel="stylesheet" href="/_nuxt/${f}">\n`;
    }
    // Find entry JS file (starts with "entry.")
    if (f.startsWith('entry.') && f.endsWith('.js')) {
      jsScripts += `  <script type="module" src="/_nuxt/${f}"></script>\n`;
    }
  }
}

if (!jsScripts) {
  // Fallback: look for any JS that might be the entry
  console.warn('No entry.*.js found, listing all JS files:');
  const allJs = readdirSync(nuxtDir).filter(f => f.endsWith('.js'));
  console.log(allJs.slice(0, 10).join(', '));
  // Use the first JS file as fallback
  if (allJs.length > 0) {
    jsScripts = `  <script type="module" src="/_nuxt/${allJs[0]}"></script>\n`;
  }
}

const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>哈特链 HeartChain</title>
  <meta name="description" content="哈特链 HeartChain - 以爱心链接世界">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="theme-color" content="#ef4444">
${cssLinks}
</head>
<body>
  <div id="__nuxt"></div>
${jsScripts}
</body>
</html>
`;

writeFileSync(indexPath, html, 'utf-8');
console.log('Created index.html for SPA mode');
console.log('CSS links:', cssLinks.split('\n').filter(Boolean).length);
console.log('JS scripts:', jsScripts.split('\n').filter(Boolean).length);
