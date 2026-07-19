const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'heartchain',
});

async function fix() {
  try {
    await client.connect();
    
    // Fix category column
    try {
      await client.query(`
        ALTER TABLE tasks 
        ALTER COLUMN category TYPE VARCHAR(50) USING category::text
      `);
      console.log('✅ Fixed category column');
    } catch(e) {
      console.log('category:', e.message);
    }
    
    // Fix status column
    try {
      await client.query(`
        ALTER TABLE tasks 
        ALTER COLUMN status TYPE VARCHAR(50) USING status::text
      `);
      console.log('✅ Fixed status column');
    } catch(e) {
      console.log('status:', e.message);
    }
    
    console.log('✅ Done!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

fix();
