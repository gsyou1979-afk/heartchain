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

    // 检查 tasks 表的所有列
    const columns = await dataSource.query(`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_name = 'tasks'
        ORDER BY ordinal_position
    `);

    console.log('Tasks table columns:');
    columns.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} ${col.column_default ? '(' + col.column_default + ')' : ''}`);
    });

    await dataSource.destroy();
}

main().catch(console.error);
