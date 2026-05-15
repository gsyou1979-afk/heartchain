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
    
    // 删除这个损坏的任务
    await client.query(`DELETE FROM tasks WHERE title = '노인사랑행사'`);
    console.log('✅ 已删除损坏的任务');
    
    // 验证
    const remaining = await client.query('SELECT id, title FROM tasks');
    console.log(`\n剩余任务数: ${remaining.rows.length}`);
    remaining.rows.forEach(t => console.log(`- ${t.title}`));
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();