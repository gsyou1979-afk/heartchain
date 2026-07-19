import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationModule } from './evaluation/evaluation.module';
import { TasksModule } from './tasks/tasks.module';
import { WalletModule } from './wallet/wallet.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    EvaluationModule,
    TasksModule,
    WalletModule,
    UsersModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
