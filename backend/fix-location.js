const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'heartchain'
});

async function main() {
  try {
    await client.connect();
    
    // 查找并删除 location 为字符串的任务
    const result = await client.query(`
      DELETE FROM tasks 
      WHERE location IS NOT NULL 
        AND jsonb_typeof(location::jsonb) IS NULL
    `);
    
    console.log(`✅ 已删除 ${result.rowCount} 个损坏的任务`);
    
    // 验证剩余任务
    const remaining = await client.query('SELECT id, title, location FROM tasks');
    console.log(`\n剩余任务数: ${remaining.rows.length}`);
    remaining.rows.forEach(t => {
      console.log(`- ${t.title}: ${JSON.stringify(t.location)}`);
    });
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();