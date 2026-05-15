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
    
    const userId = '6c347355-9df6-4bd5-a4e2-77d0089d5aa7';
    
    // 查询用户发布的任务
    const tasks = await client.query(
      'SELECT id, title, status, required_skills, location, created_at FROM tasks WHERE publisher_id = $1',
      [userId]
    );
    
    console.log('=== 用户的任务 ===\n');
    console.log(`用户ID: ${userId}`);
    console.log(`手机号: +821022098999`);
    console.log(`任务数量: ${tasks.rows.length}\n`);
    
    tasks.rows.forEach((task, i) => {
      console.log(`任务 ${i + 1}:`);
      console.log(`  ID: ${task.id}`);
      console.log(`  标题: ${task.title}`);
      console.log(`  状态: ${task.status}`);
      console.log(`  所需技能: ${JSON.stringify(task.required_skills)}`);
      console.log(`  地点: ${JSON.stringify(task.location)}`);
      console.log(`  创建时间: ${task.created_at}`);
      console.log('');
    });
    
    // 也检查一下所有任务
    console.log('=== 所有任务 ===');
    const allTasks = await client.query('SELECT id, title, publisher_id, location FROM tasks');
    console.log(`总任务数: ${allTasks.rows.length}`);
    allTasks.rows.forEach(t => {
      console.log(`- ${t.title} (publisher: ${t.publisher_id})`);
    });
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();