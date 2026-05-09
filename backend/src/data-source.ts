import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_DATABASE || 'heartchain.sqlite',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: true, // SQLite에서는 자동 동기화 활성화 (개발용)
  logging: false,
});
