const { DataSource } = require('typeorm');

async function check() {
  const ds = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    username: 'postgres',
    password: 'postgres'
  });

  await ds.initialize();
  console.log('Connected to database');

  // 查询所有用户
  const users = await ds.query('SELECT id, phone, nickname, avatar, skills, education FROM users');
  console.log('\n所有用户:');
  console.log(JSON.stringify(users, null, 2));

  await ds.destroy();
}

check().catch(console.error);
