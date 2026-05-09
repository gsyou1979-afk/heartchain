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
    
    // 查询所有用户
    const result = await client.query('SELECT id, phone, nickname, skills, education, avatar FROM users');
    
    console.log('=== 数据库中的用户 ===\n');
    result.rows.forEach((user, i) => {
      console.log(`用户 ${i + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  手机号: ${user.phone}`);
      console.log(`  昵称: ${user.nickname}`);
      console.log(`  技能: ${JSON.stringify(user.skills)}`);
      console.log(`  学历: ${JSON.stringify(user.education)}`);
      console.log(`  头像: ${user.avatar}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();