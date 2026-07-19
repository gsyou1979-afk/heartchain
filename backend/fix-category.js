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
    
    // Check if category enum exists
    const checkEnum = await client.query(`
      SELECT enumtypid::regtype as enum_name
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.enumtypid = 'tasks_category'::regtype
    `);
    
    console.log('Category enum values:', checkEnum.rows);
    
    // Drop constraint and change to varchar
    await client.query(`
      ALTER TABLE tasks 
      ALTER COLUMN category TYPE VARCHAR(50) USING category::text
    `);
    console.log('✅ Fixed category column');
    
    // Check and fix status
    await client.query(`
      ALTER TABLE tasks 
      ALTER COLUMN status TYPE VARCHAR(50) USING status::text
    `);
    console.log('✅ Fixed status column');
    
    // Drop old enums if not needed
    try {
      await client.query('DROP TYPE IF EXISTS tasks_category');
      await client.query('DROP TYPE IF EXISTS tasks_status_enum');
      console.log('✅ Dropped old enums');
    } catch(e) {
      console.log('Note:', e.message);
    }
    
    console.log('✅ All fixes applied!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

fix();
