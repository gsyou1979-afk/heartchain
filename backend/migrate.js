const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'heartchain',
});

async function migrate() {
  try {
    await client.connect();
    
    // Check existing columns
    const result = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tasks'
    `);
    const existingColumns = result.rows.map(r => r.column_name);
    console.log('Existing columns:', existingColumns);
    
    // Add missing columns
    const alterations = [
      { name: 'task_type', sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_type VARCHAR(20)' },
      { name: 'required_skills', sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS required_skills JSONB' },
      { name: 'schedule', sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS schedule JSONB' },
    ];
    
    for (const alt of alterations) {
      if (!existingColumns.includes(alt.name)) {
        try {
          await client.query(alt.sql);
          console.log(`✅ Added column: ${alt.name}`);
        } catch (e) {
          console.log(`⚠️ ${alt.name}: ${e.message}`);
        }
      } else {
        console.log(`✓ Column already exists: ${alt.name}`);
      }
    }
    
    console.log('\n✅ Migration complete!');
  } catch (e) {
    console.error('Migration failed:', e.message);
  } finally {
    await client.end();
  }
}

migrate();
