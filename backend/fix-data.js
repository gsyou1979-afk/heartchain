const { Client } = require('pg');

async function fixData() {
  const client = new Client({
    database: 'heartchain',
    user: 'postgres',
    password: 'postgres'
  });

  await client.connect();

  // 查看所有任务
  const res = await client.query('SELECT id, title, requiredskills FROM tasks');
  console.log('当前任务数据:');
  res.rows.forEach(r => {
    console.log(`ID: ${r.id}, Title: ${r.title}`);
    console.log(`  requiredskills 类型: ${typeof r.requiredskills}, 值: ${r.requiredskills}`);
  });

  // 修复 requiredskills 格式
  // 如果是字符串且包含空格，转换为 JSON 数组
  for (const row of res.rows) {
    if (typeof row.requiredskills === 'string' && row.requiredskills.includes(' ')) {
      const skills = row.requiredskills.split(' ').filter(s => s.trim());
      await client.query('UPDATE tasks SET requiredskills = $1 WHERE id = $2', [JSON.stringify(skills), row.id]);
      console.log(`修复任务: ${row.title} -> requiredskills = ${JSON.stringify(skills)}`);
    }
  }

  // 修复 schedule 格式
  const res2 = await client.query('SELECT id, schedule FROM tasks');
  for (const row of res2.rows) {
    if (typeof row.schedule === 'string' && row.schedule.startsWith('@{')) {
      // 解析 PowerShell hashtable 格式
      try {
        const obj = {};
        const inner = row.schedule.replace('@{', '').replace('}', '');
        inner.split(';').forEach(part => {
          const [key, value] = part.split('=');
          if (key && value) {
            obj[key.trim()] = value.trim();
          }
        });
        if (obj.type) {
          await client.query('UPDATE tasks SET schedule = $1 WHERE id = $2', [JSON.stringify(obj), row.id]);
          console.log(`修复 schedule: ${row.id} -> ${JSON.stringify(obj)}`);
        }
      } catch (e) {
        console.error(`无法修复 schedule: ${row.id}`, e.message);
      }
    }
  }

  // 验证修复结果
  const verify = await client.query('SELECT id, requiredskills, schedule FROM tasks');
  console.log('\n修复后验证:');
  verify.rows.forEach(r => {
    console.log(`ID: ${r.id}`);
    console.log(`  requiredskills: ${typeof r.requiredskills} = ${r.requiredskills}`);
    console.log(`  schedule: ${typeof r.schedule} = ${r.schedule}`);
  });

  await client.end();
  console.log('\n修复完成!');
}

fixData().catch(console.error);
