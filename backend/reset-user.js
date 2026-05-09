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
    
    // 先删除用户的任务
    await client.query(
      "DELETE FROM tasks WHERE publisher_id IN (SELECT id FROM users WHERE phone = '+821098765432')"
    );
    console.log('✅ 已删除用户的任务');
    
    // 删除旧用户
    await client.query(
      "DELETE FROM users WHERE phone = '+821098765432'"
    );
    console.log('✅ 已删除旧用户');
    
    console.log('\n📝 现在请在前端重新注册！');
    console.log('手机号: +821098765432');
    console.log('验证码: 123456');
    console.log('密码: 你想要的密码');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

main();
