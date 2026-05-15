const Database = require('better-sqlite3');
const crypto = require('crypto');

// 密码哈希函数
function hashPassword(password) {
  return crypto.createHash('md5').update(password + 'heartchain_salt').digest('hex');
}

const db = new Database('E:\\WorkBuddy\\heartchain\\backend\\heartchain.sqlite');

console.log('=== HeartChain 数据库直接操作 ===\n');

// 1. 查看所有用户
console.log('1. 当前所有用户:');
const users = db.prepare('SELECT id, phone, nickname, role, status, password FROM user').all();
users.forEach(u => console.log(`   ${u.phone} | ${u.nickname} | ${u.role} | ${u.status}`));
console.log('');

// 2. 重置管理员密码
console.log('2. 重置管理员密码...');
const adminHash = hashPassword('Admin@2026');
console.log('   新密码哈希:', adminHash);

const result = db.prepare('UPDATE user SET password = ? WHERE phone = ?').run(adminHash, '+821022098999');
console.log('   影响行数:', result.changes);
console.log('');

// 3. 确认更新
console.log('3. 确认更新结果:');
const admin = db.prepare('SELECT id, phone, nickname, role, password FROM user WHERE phone = ?').get('+821022098999');
if (admin) {
  console.log('   管理员信息:');
  console.log('   - 手机:', admin.phone);
  console.log('   - 昵称:', admin.nickname);
  console.log('   - 角色:', admin.role);
  console.log('   - 密码哈希:', admin.password);
}
console.log('');

// 4. 测试密码验证
console.log('4. 密码验证测试:');
const testHash = hashPassword('Admin@2026');
console.log('   Admin@2026 哈希:', testHash);
console.log('   数据库哈希:', admin?.password);
console.log('   验证结果:', testHash === admin?.password ? '✅ 成功' : '❌ 失败');

db.close();

console.log('\n=== 完成 ===');
console.log('管理员账号: +821022098999');
console.log('新密码: Admin@2026');
