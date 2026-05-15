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
    await client.query('ALTER TABLE tasks ALTER COLUMN requiredSkills TYPE text');
    console.log('Done');
  } catch (e) {
    console.error(e.message);
  } finally {
    await client.end();
  }
}

fix();
