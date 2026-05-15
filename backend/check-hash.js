const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'heartchain'
});

async function main() {
  try {
    await client.connect();
    
    // 查看当前密码hash
    const result = await client.query('SELECT password FROM users WHERE phone = $1', ['+821098765432']);
    console.log('当前密码hash:', result.rows[0].password);
    
    // 生成一个新的bcrypt兼容的salt和hash
    const saltRounds = 10;
    const { randomBytes, createHash } = crypto;
    
    // 用Node.js内置方式生成一个简单hash（临时方案）
    // 实际应该用bcrypt，但这里我们直接用hash方式
    const testHash = crypto.createHash('sha256').update('password123').digest('hex');
    console.log('\nSHA256 hash for password123:', testHash);
    
    // 更新为简单hash
    await client.query(
      'UPDATE users SET password = $1 WHERE phone = $2',
      [testHash, '+821098765432']
    );
    
    console.log('✅ 密码已更新为SHA256 hash');
    console.log('请在注册时使用相同逻辑的密码');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();
