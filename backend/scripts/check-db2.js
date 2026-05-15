const db = require('better-sqlite3')('./heartchain.sqlite');

// 查看所有表
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('=== 数据库表 ===');
tables.forEach(t => console.log(t.name));

// 找用户表
const userTable = tables.find(t => t.name.toLowerCase().includes('user'));
if (userTable) {
  const cols = db.prepare(`PRAGMA table_info(${userTable.name})`).all();
  console.log('');
  console.log(`=== ${userTable.name} 表结构 ===`);
  cols.forEach(c => console.log(c.name, c.type));
  
  const users = db.prepare(`SELECT id, phone, nickname, password FROM ${userTable.name}`).all();
  console.log('');
  console.log(`=== 用户列表（共${users.length}人）===`);
  users.forEach(u => {
    const pwdType = u.password && u.password.startsWith('$2b$') ? 'bcrypt' : 'MD5/其他';
    console.log(u.phone, u.nickname || '(无昵称)', pwdType, '|', u.password.substring(0,30) + '...');
  });
} else {
  console.log('未找到用户表');
}
