const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./heartchain.sqlite');

db.all("PRAGMA table_info(users)", (err, cols) => {
  if (err) console.error(err);
  else {
    console.log('users 테이블 컬럼:');
    cols.forEach(c => console.log(`  ${c.cid}: ${c.name} (${c.type}) ${c.notnull ? 'NOT NULL' : ''} ${c.dflt_value !== null ? 'DEFAULT '+c.dflt_value : ''}`));
  }
  db.close();
});
