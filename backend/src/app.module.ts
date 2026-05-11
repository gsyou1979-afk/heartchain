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
          // 프로덕션 모드: 반드시 DATABASE_URL 사용 (Supabase Pooler SNI 필요)
          const databaseUrl = configService.get('DATABASE_URL');
          if (!databaseUrl) {
            throw new Error(
              'DATABASE_URL 환경변수가 설정되지 않았습니다. ' +
              'Render Environment Variables에서 DATABASE_URL을 설정해주세요.\n' +
              '예: postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require'
            );
          }
          console.log('[DB] DATABASE_URL 사용 (Supabase Pooler)');
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [User, Task, PointTransaction, Team, TeamMember, Notification, AdPlacement, AdCampaign, AdCreative, ProjectAd, AdImpression, AdClick, AdFrequency, ProjectAdConversion, UserTag],
            synchronize: false,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            logging: ['error'],
          } as any;
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
