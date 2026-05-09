const { DataSource } = require('typeorm');

async function setup() {
  // 连接默认 postgres 数据库
  const ds = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres'
  });

  try {
    await ds.initialize();
    console.log('Connected to postgres');

    // 创建用户
    try {
      await ds.query("CREATE USER heartchain WITH PASSWORD 'heartchain_dev_2026'");
      console.log('User created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('User already exists');
      } else {
        console.log('User error:', e.message);
      }
    }

    // 创建数据库
    try {
      await ds.query('CREATE DATABASE heartchain OWNER heartchain');
      console.log('Database created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('Database already exists');
      } else {
        console.log('Database error:', e.message);
      }
    }

    await ds.destroy();
    console.log('Setup complete');
  } catch (e) {
    console.log('Connection error:', e.message);
  }
}

setup();
