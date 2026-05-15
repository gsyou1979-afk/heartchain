const db = require('better-sqlite3')('./heartchain.sqlite');

// 查看所有表
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('=== 所有表 ===');
tables.forEach(t => {
  console.log(t.name);
  // 查看每个表的结构
  const cols = db.prepare(`PRAGMA table_info(${t.name})`).all();
  cols.forEach(c => console.log('  ', c.name, c.type));
  const count = db.prepare(`SELECT COUNT(*) as cnt FROM ${t.name}`).get();
  console.log('  行数:', count.cnt);
  console.log('');
});
