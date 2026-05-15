const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'heartchain'
});

async function main() {
  try {
    await client.connect();
    
    // 修复学历数据（设置为null，让用户重新添加）
    await client.query(`
      UPDATE users 
      SET education = NULL 
      WHERE phone = '+821022098999'
    `);
    
    console.log('✅ 已清理错误的学历数据');
    
    // 验证
    const result = await client.query(`
      SELECT id, phone, nickname, education 
      FROM users 
      WHERE phone = '+821022098999'
    `);
    
    console.log('\n📋 当前数据:');
    console.log('   Nickname:', result.rows[0].nickname);
    console.log('   Education:', result.rows[0].education);
    
    console.log('\n✅ 数据库已清理!');
    console.log('   现在可以在前端重新添加学历了。');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();