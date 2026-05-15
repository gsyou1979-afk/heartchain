const { DataSource } = require('typeorm');

async function main() {
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
  
  // 删除所有任务
  await ds.query('DELETE FROM tasks');
  console.log('All tasks deleted');
  
  await ds.destroy();
  console.log('Done!');
}

main().catch(console.error);
