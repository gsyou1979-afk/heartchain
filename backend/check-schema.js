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
    
    // 查看表结构
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tasks'
    `);
    
    console.log('=== tasks 表结构 ===\n');
    columns.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n=== 查询该用户的所有任务 ===\n');
    const userId = '6c347355-9df6-4bd5-a4e2-77d0089d5aa7';
    const tasks = await client.query(`SELECT * FROM tasks WHERE publisher_id = $1`, [userId]);
    console.log(`任务数量: ${tasks.rows.length}`);
    
    if (tasks.rows.length > 0) {
      console.log('\n任务详情:');
      console.log(JSON.stringify(tasks.rows, null, 2));
    }
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();