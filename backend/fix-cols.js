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
    
    // 重命名列
    await client.query('ALTER TABLE tasks RENAME COLUMN "requiredSkills" TO requiredskills');
    await client.query('ALTER TABLE tasks RENAME COLUMN "location" TO location_text');
    
    console.log('列重命名完成');
    
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
