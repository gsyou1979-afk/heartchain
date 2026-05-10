import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: databaseUrl && isProduction ? 'postgres' : 'sqlite',
  ...(databaseUrl && isProduction
    ? {
        url: databaseUrl,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/migrations/*.js'],
        synchronize: true,
        logging: false,
      }
    : {
        database: process.env.DB_DATABASE || 'heartchain.sqlite',
        entities: ['src/**/*.entity.ts'],
        migrations: ['src/migrations/*.ts'],
        synchronize: true,
        logging: false,
      }),
});
