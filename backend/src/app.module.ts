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

// Ad Modules
import { AdPlacementModule } from './ad-placement/ad-placement.module';
import { AdCampaignModule } from './ad-campaign/ad-campaign.module';
import { AdCreativeModule } from './ad-creative/ad-creative.module';
import { AdProjectModule } from './ad-project/ad-project.module';
import { AdServingModule } from './ad-serving/ad-serving.module';
import { AdTargetingModule } from './ad-targeting/ad-targeting.module';
import { AdReportModule } from './ad-report/ad-report.module';

import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { PointTransaction } from './points/entities/point-transaction.entity';
import { Team, TeamMember } from './teams/entities/team.entity';
import { Notification } from './notifications/entities/notification.entity';
import { AdPlacement } from './ad-placement/entities/ad-placement.entity';
import { AdCampaign } from './ad-campaign/entities/ad-campaign.entity';
import { AdCreative } from './ad-creative/entities/ad-creative.entity';
import { ProjectAd } from './ad-project/entities/ad-project.entity';
import { AdImpression } from './ad-serving/entities/ad-impression.entity';
import { AdClick } from './ad-serving/entities/ad-click.entity';
import { AdFrequency } from './ad-serving/entities/ad-frequency.entity';
import { ProjectAdConversion } from './ad-serving/entities/project-ad-conversion.entity';
import { UserTag } from './ad-targeting/entities/user-tag.entity';

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
        const isDev = configService.get('NODE_ENV') === 'development';

        const allEntities = [User, Task, PointTransaction, Team, TeamMember, Notification, AdPlacement, AdCampaign, AdCreative, ProjectAd, AdImpression, AdClick, AdFrequency, ProjectAdConversion, UserTag];

        // 1. DATABASE_URL이 있으면 PostgreSQL 사용 (Neon / Supabase 호환)
        if (databaseUrl) {
          console.log('[DB] DATABASE_URL 사용 (PostgreSQL)');
          try {
            const url = new URL(databaseUrl);
            const host = url.hostname;
            const port = parseInt(url.port, 10) || 5432;
            const username = decodeURIComponent(url.username);
            const password = decodeURIComponent(url.password);
            const database = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

            console.log('[DB] host:', host, 'port:', port, 'user:', username, 'db:', database);

            return {
              type: 'postgres',
              host,
              port,
              username,
              password,
              database,
              ssl: {
                rejectUnauthorized: false,
              },
              extra: {
                ssl: {
                  rejectUnauthorized: false,
                },
              },
              entities: allEntities,
              synchronize: true,
              logging: ['error', 'warn'],
            } as any;
          } catch (e) {
            throw new Error(
              'DATABASE_URL 파싱 실패: ' + (e as Error).message
            );
          }
        }

        // 2. DB_* 분리 변수가 있으면 PostgreSQL 사용
        if (dbHost) {
          console.log('[DB] DB_* 환경변수 사용 (PostgreSQL)');
          return {
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: parseInt(configService.get('DB_PORT', '5432'), 10),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            ssl: {
              rejectUnauthorized: false,
            },
            entities: allEntities,
            synchronize: true,
            logging: ['error', 'warn'],
          } as any;
        }

        // 3. 둘 다 없으면 SQLite fallback (로컬 개발용)
        console.log('[DB] SQLite fallback (로컬 개발)');
        return {
          type: 'sqlite',
          database: 'E:/WorkBuddy/heartchain/backend/heartchain.sqlite',
          entities: allEntities,
          synchronize: true,
          logging: ['error', 'warn', 'log'],
        } as any;
      },
    }),

    // For AppController seed endpoint
    TypeOrmModule.forFeature([User, Task]),

    Web3Module,
    CommonModule,
    AuthModule,
    UsersModule,
    TasksModule,
    PointsModule,
    TeamsModule,
    NotificationsModule,
    AdminModule,
    // Ad System Modules
    AdPlacementModule,
    AdCampaignModule,
    AdCreativeModule,
    AdProjectModule,
    AdServingModule,
    AdTargetingModule,
    AdReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
