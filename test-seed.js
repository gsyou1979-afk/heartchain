const endpoints = [
  { name: 'quickSeed', url: 'https://heartchain-backend.onrender.com/api/v1/seed/quick', method: 'POST' },
  { name: 'adQuickSeed', url: 'https://heartchain-backend.onrender.com/api/v1/ad/project-ads/seed/quick', method: 'POST' },
  { name: 'tasks', url: 'https://heartchain-backend.onrender.com/api/v1/tasks?limit=5', method: 'GET' },
  { name: 'ads', url: 'https://heartchain-backend.onrender.com/api/v1/ad/project-ads/active?limit=5', method: 'GET' },
];

(async () => {
  for (const ep of endpoints) {
    try {
      const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
      const res = await fetch(ep.url, opts);
      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = text; }
      const preview = typeof parsed === 'object'
        ? (parsed.items ? `items=${parsed.items.length} total=${parsed.total}` : JSON.stringify(parsed).substring(0, 200))
        : parsed.substring(0, 200);
      console.log(`[${res.status}] ${ep.name}: ${preview}`);
    } catch (e) {
      console.log(`[ERR] ${ep.name}: ${e.message}`);
    }
  }
})();
