const { DataSource } = require('typeorm');
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('HeartChain2026!', 12);
  
  const ds = new DataSource({
    type: 'sqlite',
    database: './heartchain.sqlite',
    entities: [],
    synchronize: false,
  });
  
  await ds.initialize();
  
  const users = await ds.query('SELECT id, phone, nickname, password FROM users');
  console.log('=== 当前用户 ===');
  users.forEach(u => {
    const pwdType = u.password && u.password.startsWith('$2b$') ? 'bcrypt' : 'MD5/其他';
    console.log(u.phone, u.nickname || '(无昵称)', pwdType);
  });
  
  const result = await ds.query('UPDATE users SET password = ? WHERE password NOT LIKE ?', [hashedPassword, '$2b$%']);
  console.log('');
  console.log('=== 重置结果 ===');
  console.log('受影响行数:', result.affected || '未知');
  console.log('初始密码: HeartChain2026!');
  console.log('bcrypt哈希:', hashedPassword);
  
  const updated = await ds.query('SELECT id, phone, nickname, password FROM users');
  console.log('');
  console.log('=== 重置后用户 ===');
  updated.forEach(u => {
    const pwdType = u.password && u.password.startsWith('$2b$') ? 'bcrypt' : 'MD5/其他';
    console.log(u.phone, u.nickname || '(无昵称)', pwdType);
  });
  
  await ds.destroy();
}

main().catch(e => { console.error(e); process.exit(1); });
