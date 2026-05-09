import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, SKILL_POINTS_MAP } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto, SubmitProofDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, publisherId: string): Promise<Task> {
    // 自动计算积分（如果前端没传或传了0，使用 reward 字段）
    let pointsReward = dto.pointsReward ?? dto.reward;
    if (!pointsReward || pointsReward === 0) {
      pointsReward = (dto.requiredSkills || []).reduce(
        (sum, skill) => sum + (SKILL_POINTS_MAP[skill] || 20),
        0,
      );
    }

    // 序列化 schedule 为字符串
    const scheduleStr = dto.schedule ? JSON.stringify(dto.schedule) : null;
    
    // 序列化 requiredSkills 为字符串
    const requiredSkillsStr = dto.requiredSkills ? JSON.stringify(dto.requiredSkills) : null;

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      taskType: dto.taskType,
      pointsReward,
      requiredSkills: requiredSkillsStr,
      location: dto.location,
      schedule: scheduleStr,
      volunteerCount: dto.volunteerCount || 1,
      teamSize: dto.teamSize || null,
      currentParticipants: 0,
      region: dto.region,
      publisherId,
      status: 'open',
      viewCount: 0,
    });

    const savedTask = await this.taskRepository.save(task);

    // 返回前解析 requiredSkills 为数组
    if (savedTask.requiredSkills && typeof savedTask.requiredSkills === 'string') {
      try {
        savedTask.requiredSkills = JSON.parse(savedTask.requiredSkills);
      } catch {
        savedTask.requiredSkills = [];
      }
    }
    if (savedTask.schedule && typeof savedTask.schedule === 'string') {
      try {
        savedTask.schedule = JSON.parse(savedTask.schedule);
      } catch {
        // 保持原样
      }
    }

    return savedTask;
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // 解析 JSON 字符串字段
    if (task.requiredSkills && typeof task.requiredSkills === 'string') {
      try {
        task.requiredSkills = JSON.parse(task.requiredSkills);
      } catch {
        task.requiredSkills = [];
      }
    }
    if (task.schedule && typeof task.schedule === 'string') {
      try {
        task.schedule = JSON.parse(task.schedule);
      } catch {
        // 保持原样
      }
    }

    await this.taskRepository.increment({ id }, 'viewCount', 1);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.publisherId !== userId) {
      throw new ForbiddenException('Only the publisher can update this task');
    }

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      taskType: dto.taskType ?? task.taskType,
      requiredSkills: dto.requiredSkills ?? task.requiredSkills,
      location: dto.location ?? task.location,
      schedule: dto.schedule ?? task.schedule,
      pointsReward: dto.pointsReward ?? task.pointsReward,
      volunteerCount: dto.volunteerCount ?? task.volunteerCount,
    });

    return this.taskRepository.save(task);
  }

  async query(dto: QueryTaskDto) {
    const { page = 1, limit = 20, taskType, status, keyword, publisherId } = dto;

    const qb = this.taskRepository.createQueryBuilder('task')
      .orderBy('task."createdAt"', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // 默认只显示 open 状态的任务
    if (!status) {
      qb.andWhere('task.status = :status', { status: 'open' });
    } else {
      qb.andWhere('task.status = :status', { status });
    }

    if (taskType) qb.andWhere('task.taskType = :taskType', { taskType });
    if (publisherId) qb.andWhere('task.publisher_id = :publisherId', { publisherId });
    if (keyword) qb.andWhere('task.title ILIKE :keyword', { keyword: `%${keyword}%` });

    const [items, total] = await qb.getManyAndCount();

    // 解析每个任务的 JSON 字符串字段
    items.forEach(task => {
      if (task.schedule && typeof task.schedule === 'string') {
        try {
          task.schedule = JSON.parse(task.schedule);
        } catch {
          // 保持原样
        }
      }
      if (task.requiredSkills && typeof task.requiredSkills === 'string') {
        try {
          task.requiredSkills = JSON.parse(task.requiredSkills);
        } catch {
          task.requiredSkills = [];
        }
      }
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async assignTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status !== 'open') {
      throw new ForbiddenException('Task is not open for assignment');
    }

    // 判断是否是单人任务还是团队任务
    const isSingleTask = task.taskType === 'single_once' || task.taskType === 'single_multi';

    if (isSingleTask) {
      // 单人任务：接单后直接变为 in_progress
      task.assigneeId = userId;
      task.status = 'in_progress';
    } else {
      // 团队任务：增加参与者数量
      task.currentParticipants += 1;
      
      // 如果达到团队人数，任务变为 in_progress
      if (task.currentParticipants >= task.teamSize) {
        task.status = 'in_progress';
      }
    }

    return this.taskRepository.save(task);
  }

  async submitProof(taskId: string, userId: string, dto: SubmitProofDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.assigneeId !== userId) {
      throw new ForbiddenException('Only the assignee can submit proof');
    }

    task.proofEvidence = dto.evidence.map(e => ({
      type: e.type,
      url: e.url,
      text: e.text,
      timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
    })) as any;

    task.status = 'submitted';
    task.proofsSubmitted += 1;

    return this.taskRepository.save(task);
  }

  async completeTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.publisherId !== userId) {
      throw new ForbiddenException('Only the publisher can confirm completion');
    }

    task.status = 'completed';
    return this.taskRepository.save(task);
  }

  async cancelTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.publisherId !== userId) {
      throw new ForbiddenException('Only the publisher can cancel this task');
    }

    task.status = 'cancelled';
    return this.taskRepository.save(task);
  }

  async getMyTasks(userId: string, role: 'published' | 'assigned', dto: QueryTaskDto) {
    const { page = 1, limit = 20, status } = dto;
    const qb = this.taskRepository.createQueryBuilder('task')
      .orderBy('task."createdAt"', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (role === 'published') {
      qb.where('task.publisher_id = :userId', { userId });
    } else {
      qb.where('task.assignee_id = :userId', { userId });
    }

    if (status) qb.andWhere('task.status = :status', { status });

    const [items, total] = await qb.getManyAndCount();

    // 解析每个任务的 JSON 字符串字段
    items.forEach(task => {
      if (task.schedule && typeof task.schedule === 'string') {
        try {
          task.schedule = JSON.parse(task.schedule);
        } catch {
          // 保持原样
        }
      }
      if (task.requiredSkills && typeof task.requiredSkills === 'string') {
        try {
          task.requiredSkills = JSON.parse(task.requiredSkills);
        } catch {
          task.requiredSkills = [];
        }
      }
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
