import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { TasksService, CreateTaskDto } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() body: { helperId: number }) {
    return this.tasksService.complete(+id, body.helperId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.tasksService.cancel(+id);
  }
}
