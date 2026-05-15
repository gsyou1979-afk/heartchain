const { DataSource } = require('typeorm');

async function check() {
  const ds = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'heartchain',
    password: 'heartchain_dev_2026',
    database: 'heartchain'
  });

  try {
    await ds.initialize();
    const tables = await ds.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    console.log('Tables:', tables.map(t => t.tablename));
    await ds.destroy();
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check();
