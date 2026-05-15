const crypto = require('crypto');

// 生成MD5哈希
function hashPassword(password) {
  return crypto.createHash('md5').update(password + 'heartchain_salt').digest('hex');
}

// 测试密码
const testPassword = 'password123';
const hash = hashPassword(testPassword);
console.log(`${testPassword} 的哈希值: ${hash}`);

// 直接用PostgreSQL更新密码（假设本地数据库）
const { Client } = require('pg');

async function updatePassword() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    
    // 更新测试账号的密码
    const result = await client.query(
      `UPDATE users SET password = $1 WHERE phone = $2 RETURNING id, phone`,
      [hash, '+821098765432']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ 密码更新成功!');
      console.log('用户:', result.rows[0]);
    } else {
      console.log('❌ 用户不存在');
    }
  } catch (err) {
    console.error('错误:', err.message);
  } finally {
    await client.end();
  }
}

updatePassword();
