// HeartChain DB Migration Runner
// Run: node run-migration.js "postgresql://user:pass@host/db?sslmode=require"
const { Client } = require('pg');

const dbUrl = process.argv[2] || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('Usage: node run-migration.js "postgresql://..."');
  console.error('Or set DATABASE_URL env var.');
  process.exit(1);
}

const SQL = `
-- 1. Add publisher_reward column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS publisher_reward INTEGER DEFAULT 0;
COMMENT ON COLUMN tasks.publisher_reward IS '发布人奖励积分（任务完成后由平台铸造发放给发布人）';

-- 2. Verify
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'publisher_reward';
`;

async function main() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to database.');
    const res = await client.query(SQL);
    console.log('Migration completed successfully.');
    if (res[res.length - 1]?.rows?.length > 0) {
      console.log('Verification:', JSON.stringify(res[res.length - 1].rows[0], null, 2));
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
