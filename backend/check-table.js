const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'heartchain',
});

async function check() {
  try {
    await client.connect();
    const result = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position
    `);
    console.log('Tasks table columns:');
    result.rows.forEach(r => {
      console.log(`  ${r.column_name}: ${r.data_type} (default: ${r.column_default})`);
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

check();
