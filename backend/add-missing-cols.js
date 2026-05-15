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

    // 检查并添加缺失的列
    const missingColumns = [
        { name: 'currentparticipants', type: 'INTEGER', default: 0 }
    ];

    for (const col of missingColumns) {
        const result = await dataSource.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = '${col.name}'
        `);

        if (result.length === 0) {
            console.log(`⚠️ Adding column: ${col.name}`);
            await dataSource.query(`
                ALTER TABLE tasks ADD COLUMN ${col.name} ${col.type} DEFAULT ${col.default}
            `);
            console.log(`✅ Added column: ${col.name}`);
        } else {
            console.log(`✅ Column already exists: ${col.name}`);
        }
    }

    // 显示最终列
    const columns = await dataSource.query(`
        SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks'
    `);
    console.log('\nFinal columns:', columns.map(c => c.column_name).join(', '));

    await dataSource.destroy();
    console.log('\n✅ Done!');
}

main().catch(console.error);
