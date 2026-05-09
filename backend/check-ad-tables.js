const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./heartchain.sqlite');

db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'ad_%'", (e, tables) => {
  if (e) { console.error('Error:', e); db.close(); return; }
  console.log('Ad tables found:', tables.map(t => t.name));

  // Check each table
  tables.forEach(t => {
    db.get(`SELECT COUNT(*) as c FROM ${t.name}`, (err, row) => {
      if (!err) console.log(`  ${t.name}: ${row.c} rows`);
    });
  });

  // Check tasks and users
  db.get('SELECT COUNT(*) as c FROM tasks', (err, row) => {
    if (!err) console.log('Tasks:', row.c);
  });
  db.get('SELECT COUNT(*) as c FROM users', (err, row) => {
    if (!err) console.log('Users:', row.c);
  });

  setTimeout(() => db.close(), 500);
});
