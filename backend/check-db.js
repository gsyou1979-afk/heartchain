const { Client } = require('pg');

async function check() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  await client.connect();

  // 查看 tasks 表结构
  const cols = await client.query(`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name = 'tasks'
    ORDER BY ordinal_position
  `);

  console.log('Tasks 表结构:');
  cols.rows.forEach(r => {
    console.log(`  ${r.column_name}: ${r.data_type} (${r.udt_name})`);
  });

  await client.end();
}

check().catch(console.error);
