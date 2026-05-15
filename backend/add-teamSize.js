const { DataSource } = require('typeorm');

const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'heartchain',
    username: 'postgres',
    password: 'postgres',
    schema: 'public'
});

async function main() {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // 检查 tasks 表是否有 teamSize 列
    const result = await dataSource.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'teamSize'
    `);

    if (result.length === 0) {
        console.log('⚠️ teamSize column not found, adding...');
        await dataSource.query(`
            ALTER TABLE tasks ADD COLUMN teamSize INTEGER DEFAULT 1
        `);
        console.log('✅ teamSize column added');
    } else {
        console.log('✅ teamSize column already exists');
    }

    // 检查是否还有其他缺失的列
    const columns = await dataSource.query(`
        SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks'
    `);
    console.log('Current columns:', columns.map(c => c.column_name));

    await dataSource.destroy();
    console.log('Done!');
}

main().catch(console.error);
