import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PointsModule } from './points/points.module';
import { TeamsModule } from './teams/teams.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Web3Module } from './web3/web3.module';
import { AdminModule } from './admin/admin.module';

import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { PointTransaction } from './points/entities/point-transaction.entity';
import { Team, TeamMember } from './teams/entities/team.entity';
import { Notification } from './notifications/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const dbHost = configService.get('DB_HOST');

        // DATABASE_URL 또는 DB_HOST가 설정되어 있으면 PostgreSQL 사용
        if (databaseUrl || dbHost) {
          return {
            type: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'heartchain'),
            password: configService.get('DB_PASSWORD', 'heartchain_dev_2026'),
            database: configService.get('DB_DATABASE', 'heartchain'),
            entities: [User, Task, PointTransaction, Team, TeamMember, Notification],
            synchronize: false,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            logging: ['error'],
          } as any;
        }

        // 둘 다 없으면 SQLite fallback (DB_PATH 환경변수 사용, 기본값 상대경로)
        const dbPath = configService.get('DB_PATH', './heartchain.sqlite');
        return {
          type: 'sqlite',
          database: dbPath,
          entities: [User, Task, PointTransaction, Team, TeamMember, Notification],
          synchronize: true,
          logging: ['error', 'warn', 'log'],
        } as any;
      },
    }),

    Web3Module,
    CommonModule,
    AuthModule,
    UsersModule,
    TasksModule,
    PointsModule,
    TeamsModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
