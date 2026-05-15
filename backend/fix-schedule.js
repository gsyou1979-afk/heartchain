const { Client } = require('pg');

async function fix() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  await client.connect();

  // 删除旧任务
  console.log('1. 删除旧任务...');
  await client.query('DELETE FROM tasks');
  console.log('   已删除');

  // 将 schedule 从 jsonb 改为 text
  console.log('2. 修改 schedule 列类型为 text...');
  await client.query('ALTER TABLE tasks ALTER COLUMN schedule TYPE text');
  console.log('   已修改');

  // 验证
  console.log('\n3. 验证表结构:');
  const res = await client.query(`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name IN ('schedule', 'requiredSkills', 'location')
  `);
  res.rows.forEach(r => console.log(`   ${r.column_name}: ${r.data_type} (${r.udt_name})`));

  await client.end();
  console.log('\n✅ 完成!');
}

fix().catch(console.error);
