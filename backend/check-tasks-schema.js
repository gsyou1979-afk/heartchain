const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./heartchain.sqlite');
db.all("PRAGMA table_info(tasks)", (err, cols) => {
  if (err) console.error(err);
  else cols.forEach(c => console.log(`  ${c.cid}: ${c.name} (${c.type})`));
  db.close();
});
