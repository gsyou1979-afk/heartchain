import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 3000;

  // Seed: create test user if hc_users table is empty
  try {
    const ds = app.get(DataSource);
    const userRepo = ds.getRepository('hc_users');
    const count = await userRepo.count();
    if (count === 0) {
      await userRepo.save({
        name: 'KP',
        phone: '+821022098999',
        password_hash: 'seed',
        balance: 50000,
        reservedBalance: 0,
        totalPoints: 50000,
        level: 3,
        creditScore: 5.0,
        helpCount: 10,
      });
      console.log('[SEED] Test user created: KP, balance=50000');
    } else {
      console.log('[SEED] Users already exist:', count);
    }
  } catch (e) {
    console.log('[SEED] Skipped:', (e as Error).message);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
