const { Client } = require('pg');

async function fix() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    
    // 改为 text 类型
    await client.query('ALTER TABLE tasks ALTER COLUMN requiredskills TYPE text');
    await client.query('ALTER TABLE tasks ALTER COLUMN location_text TYPE text');
    
    console.log('类型修改完成');
    
    // 验证
    const res = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'tasks' AND column_name IN ('requiredskills', 'location_text', 'schedule')
    `);
    console.log('当前结构:');
    res.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
  } catch (e) {
    console.error(e.message);
  } finally {
    await client.end();
  }
}

fix();
