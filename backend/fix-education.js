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
    
    // 直接用 SQL 设置正确的学历数据
    const eduData = JSON.stringify([
      { level: 'bachelor', school: '한국대학교', year: '2020' }
    ]);
    
    await client.query(`
      UPDATE users 
      SET education = $1::jsonb
      WHERE phone = '+821022098999'
    `, [eduData]);
    
    console.log('✅ 直接用 SQL 设置学历成功');
    
    // 验证
    const result = await client.query(`
      SELECT id, phone, nickname, education 
      FROM users 
      WHERE phone = '+821022098999'
    `);
    
    console.log('\n📋 验证结果:');
    console.log('   Nickname:', result.rows[0].nickname);
    console.log('   Education:', JSON.stringify(result.rows[0].education));
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();