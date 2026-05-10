import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

const baseOptions = {
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
  logging: false,
};

export const AppDataSource = databaseUrl && isProduction
  ? new DataSource({
      type: 'postgres',
      url: databaseUrl,
      ...baseOptions,
    } as any)
  : new DataSource({
      type: 'sqlite',
      database: process.env.DB_DATABASE || 'heartchain.sqlite',
      ...baseOptions,
    } as any);
