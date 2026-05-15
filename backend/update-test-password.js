const crypto = require('crypto');
const { Client } = require('pg');

async function updatePassword() {
  const hash = crypto.createHash('md5').update('password123' + 'heartchain_salt').digest('hex');
  console.log('密码哈希:', hash);

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    const result = await client.query(
      `UPDATE users SET password = $1 WHERE phone = $2 RETURNING id, phone`,
      [hash, '+821098765432']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ 密码更新成功!', result.rows[0]);
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
