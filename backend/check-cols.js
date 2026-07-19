const { Client } = require('pg');

async function check() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position
    `);
    console.log('Tasks 表所有列:');
    res.rows.forEach(r => {
      console.log(`  ${r.column_name}: ${r.data_type} (${r.udt_name})`);
    });
  } catch (e) {
    console.error(e.message);
  } finally {
    await client.end();
  }
}

check();
