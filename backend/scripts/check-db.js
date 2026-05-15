const { DataSource } = require('typeorm');

async function main() {
  const ds = new DataSource({
    type: 'sqlite',
    database: './heartchain.sqlite',
    entities: [],
    synchronize: false,
  });
  
  await ds.initialize();
  
  // 查看所有表
  const tables = await ds.query("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('=== 数据库表 ===');
  tables.forEach(t => console.log(t.name));
  
  // 查看用户表结构
  const userTable = tables.find(t => t.name.toLowerCase().includes('user'));
  if (userTable) {
    const cols = await ds.query(`PRAGMA table_info(${userTable.name})`);
    console.log('');
    console.log(`=== ${userTable.name} 表结构 ===`);
    cols.forEach(c => console.log(c.name, c.type));
    
    const count = await ds.query(`SELECT COUNT(*) as cnt FROM ${userTable.name}`);
    console.log('用户数:', count[0].cnt);
  }
  
  await ds.destroy();
}

main().catch(e => { console.error(e); process.exit(1); });
