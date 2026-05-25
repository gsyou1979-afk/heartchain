import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { HelpRequest } from './entities/help-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, HelpRequest])],
  controllers: [TasksController, HelpController],
  providers: [TasksService, HelpService],
  exports: [TasksService, HelpService],
})
export class TasksModule {}
