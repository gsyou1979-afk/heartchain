const { DataSource } = require('typeorm');

async function test() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'heartchain',
    entities: ['src/**/*.entity.ts'],
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('DB Connected!');

    const tasks = await dataSource.query('SELECT * FROM tasks LIMIT 5');
    console.log('Tasks:', tasks);

    await dataSource.destroy();
  } catch (err) {
    console.error('Error:', err.message);
    if (err.query) {
      console.error('Query:', err.query);
    }
    if (err.parameters) {
      console.error('Parameters:', err.parameters);
    }
  }
}

test();
