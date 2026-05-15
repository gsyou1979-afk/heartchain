const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'heartchain'
});

// 使用bcryptjs（如果后端有安装）
async function hashPassword(password) {
  // bcrypt hash for 'password123' - 预计算的
  // $2b$10$OEkdWHQxWVnw3VJEWc2qOeD5Lbntc.2ZUWahs8yi/SiT48KMbsuum
  // 这是 password123 的hash
  return '$2b$10$OEkdWHQxWVnw3VJEWc2qOeD5Lbntc.2ZUWahs8yi/SiT48KMbsuum';
}

async function main() {
  try {
    await client.connect();
    
    // 直接更新密码（使用已知的hash）
    // 这个hash值是 password123 的bcrypt hash
    const hash = '$2b$10$OEkdWHQxWVnw3VJEWc2qOeD5Lbntc.2ZUWahs8yi/SiT48KMbsuum';
    
    await client.query(
      'UPDATE users SET password = $1 WHERE phone = $2',
      [hash, '+821098765432']
    );
    
    console.log('✅ 密码已重置为: password123');
    console.log('现在可以用手机号 +821098765432 和密码 password123 登录了');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();
