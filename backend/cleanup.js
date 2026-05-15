const { DataSource } = require('typeorm');

async function cleanup() {
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

  // 删除所有任务（可能有损坏的 location 数据）
  await ds.query('DELETE FROM tasks');
  console.log('Deleted all tasks');

  // 重置自增ID
  await ds.query('ALTER SEQUENCE tasks_id_seq RESTART WITH 1');
  console.log('Reset ID sequence');

  await ds.destroy();
  console.log('Done!');
}

cleanup().catch(console.error);
