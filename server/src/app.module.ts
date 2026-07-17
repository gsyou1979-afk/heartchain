import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationModule } from './evaluation/evaluation.module';
import { TasksModule } from './tasks/tasks.module';
import { WalletModule } from './wallet/wallet.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // 마이그레이션으로 관리
      logging: process.env.NODE_ENV === 'development',
    }),
    EvaluationModule,
    TasksModule,
    WalletModule,
    UsersModule,
    TransactionsModule,
  ],
})
export class AppModule {}
