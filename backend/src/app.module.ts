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
        const isDev = configService.get('NODE_ENV') === 'development';
        
        if (isDev) {
          // 개발 모드: SQLite 사용 (타입 체크 임시 비활성화)
          return {
            type: 'sqlite',
            database: 'E:/WorkBuddy/heartchain/backend/heartchain.sqlite', // Windows에서도 작동하는 경로
            entities: [User, Task, PointTransaction, Team, TeamMember, Notification, AdPlacement, AdCampaign, AdCreative, ProjectAd, AdImpression, AdClick, AdFrequency, ProjectAdConversion, UserTag],
            synchronize: true,
            logging: ['error', 'warn', 'log'], // log 추가로 초기화 확인
          } as any;
        } else {
          // 프로덕션 모드: PostgreSQL 사용
          const databaseUrl = configService.get('DATABASE_URL');
          const dbHost = configService.get('DB_HOST');
          
          if (databaseUrl) {
            // DATABASE_URL이 설정된 경우: URL 파싱하여 분리 파라미터로 연결
            // (Supabase Pooler SNI 문제 해결: pg 드라이버가 URL 방식에서 SNI를
            //  올바르게 전송하지 못하므로, 직접 host/port/user/pass 설정 + servername)
            console.log('[DB] DATABASE_URL 파싱하여 연결');
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
                  // Supabase Pooler는 servername(SNI)으로 tenant 식별
                  servername: host,
                },
                extra: {
                  ssl: {
                    rejectUnauthorized: false,
                    servername: host,
                  },
                },
                entities: [User, Task, PointTransaction, Team, TeamMember, Notification, AdPlacement, AdCampaign, AdCreative, ProjectAd, AdImpression, AdClick, AdFrequency, ProjectAdConversion, UserTag],
                synchronize: false,
                migrations: ['dist/migrations/*.js'],
                migrationsRun: true,
                logging: ['error'],
              } as any;
            } catch (e) {
              throw new Error(
                'DATABASE_URL 파싱 실패: ' + (e as Error).message + '\n' +
                '올바른 형식: postgresql://user:password@host:port/database'
              );
            }
          } else if (dbHost) {
            // DB_* 분리 변수 사용
            console.log('[DB] DB_* 환경변수 사용');
            return {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: parseInt(configService.get('DB_PORT', '5432'), 10),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE'),
              ssl: {
                rejectUnauthorized: false,
                servername: configService.get('DB_HOST'),
              },
              extra: {
                ssl: {
                  rejectUnauthorized: false,
                  servername: configService.get('DB_HOST'),
                },
              },
              entities: [User, Task, PointTransaction, Team, TeamMember, Notification, AdPlacement, AdCampaign, AdCreative, ProjectAd, AdImpression, AdClick, AdFrequency, ProjectAdConversion, UserTag],
              synchronize: false,
              migrations: ['dist/migrations/*.js'],
              migrationsRun: true,
              logging: ['error'],
            } as any;
          } else {
            throw new Error(
              '데이터베이스 연결 정보가 없습니다.\n' +
              'Render Environment Variables에서 DATABASE_URL을 설정해주세요.\n' +
              '예: postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres'
            );
          }
        }
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
