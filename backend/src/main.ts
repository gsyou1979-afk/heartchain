import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug'] });

  // 使用全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3005);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS - allow all origins (app uses Bearer token, not cookies)
  // Note: origin: '*' + credentials: true is invalid in browsers
  // Since we use Bearer token auth, credentials are not needed.
  app.enableCors({
    origin: '*',
    credentials: false,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HeartChain API')
    .setDescription('HeartChain (哈特链) - Blockchain-based Volunteer Service Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Users', 'User Management')
    .addTag('Tasks', 'Task Management')
    .addTag('Points', 'HeartCoin Points System')
    .addTag('Teams', 'Team/Organization Management')
    .addTag('Notifications', 'Push Notifications')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port, '0.0.0.0');

  // Debug: 打印配置信息（不输出敏感值）
  console.log('[DEBUG] NODE_ENV:', configService.get('NODE_ENV'));
  console.log('[DEBUG] DATABASE_URL:', configService.get('DATABASE_URL') ? 'SET (length: ' + configService.get('DATABASE_URL').length + ')' : 'NOT SET');
  console.log('[DEBUG] PORT:', port);

  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║           HeartChain API Server                   ║
  ║           哈特链 - 区块链好人好事平台               ║
  ╠══════════════════════════════════════════════════╣
  ║  Server:  http://localhost:${port}                   ║
  ║  API:     http://localhost:${port}/${apiPrefix}        ║
  ║  Swagger: http://localhost:${port}/${apiPrefix}/docs   ║
  ║  Env:     ${configService.get('NODE_ENV') || 'development'}                                ║
  ╚══════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('❌ HeartChain 启动失败:', err.message || err);
  process.exit(1);
});
