import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded, static as expressStatic } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Custom body parser with larger limit for base64 image uploads
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // 使用全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3005);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // CORS
  const allowedOrigins = nodeEnv === 'production'
    ? (configService.get<string>('CORS_ORIGINS') || 'https://heartchain-five.vercel.app').split(',')
    : '*';

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Serve static files from uploads directory
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (fs.existsSync(uploadsDir)) {
    app.use('/uploads', (req: any, res: any, next: any) => {
      const filePath = join(uploadsDir, req.path);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    });
  }

  // Global prefix — set BEFORE SPA fallback so API routes work
  app.setGlobalPrefix(apiPrefix);

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

  // Serve frontend static files (SPA) — MUST be after all API routes
  const frontendDir = join(__dirname, 'frontend');
  const frontendIndex = join(frontendDir, 'index.html');

  if (fs.existsSync(frontendIndex)) {
    console.log('[DEBUG] Serving frontend from:', frontendDir);
    app.use(expressStatic(frontendDir, { index: false }));

    // SPA fallback: all non-API/non-upload routes serve index.html
    // This must be registered AFTER all other routes
    const expressAdapter = app.getHttpAdapter();
    const expressApp = expressAdapter.getInstance();
    expressApp.get('*', (req: any, res: any, next: any) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return next();
      }
      res.sendFile(frontendIndex);
    });
  } else {
    console.log('[DEBUG] Frontend dist not found, API-only mode');
  }

  await app.listen(port, '0.0.0.0');

  console.log('[DEBUG] NODE_ENV:', nodeEnv);
  console.log('[DEBUG] CORS_ORIGINS:', allowedOrigins);
  console.log('[DEBUG] PORT:', port);
  console.log(`\n  ╔══════════════════════════════════════════════════╗
  ║           HeartChain API Server                   ║
  ║           哈特链 - 区块链好人好事平台               ║
  ╠══════════════════════════════════════════════════╣
  ║  Server:  http://localhost:${port}
  ║  API:     http://localhost:${port}/${apiPrefix}
  ║  Swagger: http://localhost:${port}/${apiPrefix}/docs
  ║  Env:     ${nodeEnv}
  ╚══════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('❌ HeartChain 启动失败:', err.message || err);
  process.exit(1);
});
