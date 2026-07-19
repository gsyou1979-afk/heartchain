/**
 * 管理员后台模块
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Team } from '../teams/entities/team.entity';
import { PointTransaction } from '../points/entities/point-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Team, PointTransaction])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
