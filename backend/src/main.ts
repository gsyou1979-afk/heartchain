import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Custom body parser with larger limit for base64 image uploads (default 100KB is too small)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // 使用全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3005);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS - 生产环境限制来源，开发环境允许所有
  const allowedOrigins = nodeEnv === 'production'
    ? (configService.get<string>('CORS_ORIGINS') || 'https://heartchain-five.vercel.app').split(',')
    : '*';

  app.enableCors({
    origin: allowedOrigins,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Serve static files from uploads directory
  const uploadsDir = join(__dirname, '..', 'uploads');
  app.use('/uploads', (req: any, res: any, next: any) => {
    const fs = require('fs');
    const filePath = join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
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
  console.log('[DEBUG] NODE_ENV:', nodeEnv);
  console.log('[DEBUG] CORS_ORIGINS:', allowedOrigins);
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
  ║  Env:     ${nodeEnv}                                ║
  ╚══════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('❌ HeartChain 启动失败:', err.message || err);
  process.exit(1);
});
