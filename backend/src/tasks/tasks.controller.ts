import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto, SubmitProofDto } from './dto/task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Query tasks with filters' })
  async queryTasks(@Query() dto: QueryTaskDto) {
    return this.tasksService.query(dto);
  }

  @Get('my/published')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my published tasks' })
  async getMyPublishedTasks(
    @CurrentUser('id') userId: string,
    @Query() dto: QueryTaskDto,
  ) {
    return this.tasksService.getMyTasks(userId, 'published', dto);
  }

  @Get('my/joined')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my joined tasks' })
  async getMyJoinedTasks(
    @CurrentUser('id') userId: string,
    @Query() dto: QueryTaskDto,
  ) {
    return this.tasksService.getMyTasks(userId, 'assigned', dto);
  }

  @Get('my/assigned')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my assigned tasks (alias)' })
  async getMyAssignedTasks(
    @CurrentUser('id') userId: string,
    @Query() dto: QueryTaskDto,
  ) {
    return this.tasksService.getMyTasks(userId, 'assigned', dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new task' })
  async createTask(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(dto, userId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update task' })
  async updateTask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto, userId);
  }

  @Post(':id/assign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Assign task to self (accept task)' })
  async assignTask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.assignTask(id, userId);
  }

  @Post(':id/join')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Join a task (alias for assign)' })
  async joinTask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.assignTask(id, userId);
  }

  @Post(':id/proof')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit completion proof' })
  async submitProof(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitProofDto,
  ) {
    return this.tasksService.submitProof(id, userId, dto);
  }

  @Post(':id/complete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Confirm task completion (publisher only)' })
  async completeTask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.completeTask(id, userId);
  }

  @Post(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel task (publisher only)' })
  async cancelTask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.cancelTask(id, userId);
  }
}
