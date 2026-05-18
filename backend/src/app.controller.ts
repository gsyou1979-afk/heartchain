import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserStatus } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { Public } from './common/decorators/public.decorator';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Server health check endpoint' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('info')
  @ApiOperation({ summary: 'API info', description: 'Get HeartChain API information' })
  getInfo() {
    return this.appService.getInfo();
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Platform statistics', description: 'Get platform-wide statistics for homepage display' })
  async getStats() {
    const [totalUsers, totalTasks, completedTasks, totalPoints] = await Promise.all([
      this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
      this.taskRepository.count(),
      this.taskRepository.count({ where: { status: 'completed' } }),
      this.taskRepository
        .createQueryBuilder('task')
        .select('COALESCE(SUM(task.pointsReward), 0)', 'total')
        .where('task.status = :status', { status: 'completed' })
        .getRawOne()
        .then((r: any) => parseFloat(r?.total || 0)),
    ]);

    return {
      volunteers: totalUsers,
      tasks: totalTasks,
      completedTasks,
      totalPoints,
    };
  }

  /**
   * ONE-TIME seed endpoint to migrate data from SQLite to PostgreSQL
   * DELETE THIS AFTER USE!
   */
  @Public()
  @Post('seed/migrate-data')
  @ApiOperation({ summary: '[TEMP] Migrate data from SQLite', description: 'One-time data migration endpoint. DELETE AFTER USE.' })
  async migrateData() {
    const results: any = { users: { created: 0, skipped: [] }, tasks: { created: 0, skipped: [] } };

    // === USERS ===
    const usersData = [
      {
        id: 'fc1fb921-df18-434b-980c-40e24575380c',
        phone: '+8210test001',
        password: '4988dd6405a5d97a47a2a74bf81fd357', // password123
        nickname: '홍길동',
        role: 'volunteer',
        status: 'active',
        creditScore: 85,
        pointBalance: 120.0,
        phoneVerified: true,
        region: 'Busan',
        createdAt: '2026-05-07T05:22:58.625Z',
        updatedAt: '2026-05-07T05:22:58.625Z',
      },
      {
        id: 'b6964ce2-d99f-46bb-9c39-1c3bf843369e',
        phone: '+821098765432',
        password: '4988dd6405a5d97a47a2a74bf81fd357', // password123
        nickname: '테스트사용자',
        role: 'volunteer',
        status: 'active',
        creditScore: 100,
        pointBalance: 500.0,
        phoneVerified: true,
        region: 'Seoul',
        createdAt: '2026-05-07T05:23:43.431Z',
        updatedAt: '2026-05-07T05:23:43.431Z',
      },
      {
        id: 'e6abcb59-0678-4a81-a2a3-ba3e057f4015',
        phone: '+821022098999',
        password: '1dead74c5d4479be48d8a1c7ef25f18e', // admin123
        nickname: '관리자',
        role: 'admin',
        status: 'active',
        creditScore: 100,
        pointBalance: 9999.0,
        phoneVerified: true,
        region: 'Seoul',
        createdAt: '2026-05-07T05:23:43.431Z',
        updatedAt: '2026-05-07T05:23:43.431Z',
      },
    ];

    for (const uData of usersData) {
      const existing = await this.userRepository.findOne({ where: { id: uData.id } });
      if (existing) {
        // Update password hash to MD5 format for consistency
        existing.password = uData.password;
        await this.userRepository.save(existing as any);
        results.users.skipped.push(uData.phone + ' (密码已更新)');
        continue;
      }

      const user = this.userRepository.create({
        ...uData,
        createdAt: new Date(uData.createdAt),
        updatedAt: new Date(uData.updatedAt),
      } as any);
      await this.userRepository.save(user);
      results.users.created++;
    }

    // === TASKS ===
    const adminUserId = 'e6abcb59-0678-4a81-a2a3-ba3e057f4015';
    const testUserId = 'b6964ce2-d99f-46bb-9c39-1c3bf843369e';

    const tasksData = [
      {
        id: '73a9eefb-b9bb-46f7-bdf3-d300f8b1d6fe',
        title: '노인복지관 청소 봉사',
        description: '지역 노인복지관 청소 및 정리 봉사활동입니다. 어르신들을 위해 밝고 깨끗한 환경을 만들어 주세요!',
        taskType: 'single_once',
        status: 'open',
        location: '서울 강남구 노인복지관',
        schedule: JSON.stringify({ type: 'once', date: '2026-05-08', startTime: '09:00', endTime: '12:00' }),
        pointsReward: 50,
        volunteerCount: 1,
        teamSize: 1,
        currentParticipants: 0,
        publisherId: adminUserId,
        createdAt: '2026-05-07T05:25:53.677Z',
        updatedAt: '2026-05-07T05:25:53.677Z',
      },
      {
        id: 'bda04a97-5c59-4d11-80c7-32c034025f24',
        title: '어린이 도서관 독서 지도',
        description: '초등학교 저학년 어린이들을 위한 독서 지도 봉사. 책 읽어주기 및 독후감 작성 도움.',
        taskType: 'single_multi',
        status: 'completed',
        location: '부산 해운대구 어린이 도서관',
        schedule: JSON.stringify({ type: 'range', startDate: '2026-05-08', endDate: '2026-05-14' }),
        pointsReward: 80,
        volunteerCount: 1,
        teamSize: 1,
        currentParticipants: 0,
        publisherId: adminUserId,
        assigneeId: testUserId,
        createdAt: '2026-05-07T05:25:53.677Z',
        updatedAt: '2026-05-07T07:16:15.000Z',
      },
      {
        id: '04d67585-dea5-410b-8f68-2b8badbb7df0',
        title: '환경 정화 캠페인 (팀)',
        description: '한강 공원 쓰레기 줍기 캠페인입니다. 팀을 이루어 함께 환경을 지켜요!',
        taskType: 'team_once',
        status: 'open',
        location: '서울 한강공원 여의도',
        schedule: JSON.stringify({ type: 'once', date: '2026-05-14', startTime: '10:00', endTime: '14:00' }),
        pointsReward: 100,
        volunteerCount: 1,
        teamSize: 10,
        currentParticipants: 0,
        publisherId: adminUserId,
        createdAt: '2026-05-07T05:25:53.677Z',
        updatedAt: '2026-05-07T05:25:53.677Z',
      },
      {
        id: '981ea220-f541-4ceb-bc91-ca5bce92e122',
        title: '清扫大街整顿环境',
        description: '扫地，冲地，收拾垃圾\n\n💭 发布缘由：需要整顿环境\n\n❤️ 受益人信息：\n类型：社区公共\n关系：邻居\n简介：富川站\n\n🎁 志愿者获得：志愿服务经验、免费工作餐\n\n🤝 发布人承诺：现场全程指导',
        taskType: 'team_once',
        status: 'open',
        requiredSkills: JSON.stringify(['保洁']),
        location: '富川站',
        schedule: JSON.stringify({ type: 'once', date: '2026-05-20', startTime: '08:00', endTime: '09:00' }),
        pointsReward: 10,
        volunteerCount: 1,
        teamSize: 10,
        currentParticipants: 0,
        publisherId: adminUserId,
        createdAt: '2026-05-11T09:21:02.000Z',
        updatedAt: '2026-05-11T09:21:02.000Z',
      },
    ];

    for (const tData of tasksData) {
      const existing = await this.taskRepository.findOne({ where: { id: tData.id } });
      if (existing) {
        results.tasks.skipped.push(tData.title);
        continue;
      }

      const task = this.taskRepository.create({
        ...tData,
        publisher: { id: tData.publisherId } as User,
        assignee: tData.assigneeId ? { id: tData.assigneeId } as User : null,
        createdAt: new Date(tData.createdAt),
        updatedAt: new Date(tData.updatedAt),
      } as any);
      await this.taskRepository.save(task);
      results.tasks.created++;
    }

    return {
      success: true,
      message: 'Data migration completed',
      ...results,
    };
  }

  @Public()
  @Post('seed/reset-passwords')
  @ApiOperation({ summary: '[TEMP] Reset all passwords to Admin@2026', description: 'Reset all user passwords. DELETE AFTER USE.' })
  async resetAllPasswords() {
    const bcrypt = await import('bcryptjs');
    const newPassword = 'Admin@2026';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const users = await this.userRepository.find();
    let updated = 0;
    for (const user of users) {
      user.password = hashedPassword;
      await this.userRepository.save(user);
      updated++;
    }

    return {
      success: true,
      message: `All ${updated} user passwords have been reset to Admin@2026`,
      updated,
    };
  }

  @Public()
  @Post('seed/fix-users')
  @ApiOperation({ summary: '[TEMP] Fix masked phone numbers and reset passwords', description: 'Fix all masked phone numbers to real format and reset passwords to Admin@2026' })
  async fixUsers() {
    const bcrypt = await import('bcryptjs');
    const newPassword = 'Admin@2026';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Map of masked phones to real phones
    const phoneMap: Record<string, string> = {
      '+821****8999': '+821000008999',
      '+821****5432': '+821000005432',
    };

    const users = await this.userRepository.find();
    const results: any = { fixed: [], skipped: [], errors: [] };

    for (const user of users) {
      try {
        // Fix masked phone numbers
        if (phoneMap[user.phone]) {
          user.phone = phoneMap[user.phone];
        }
        // Reset password to known value
        user.password = hashedPassword;
        await this.userRepository.save(user);
        results.fixed.push({ id: user.id, phone: user.phone, nickname: user.nickname });
      } catch (e: any) {
        results.errors.push({ id: user.id, error: e.message });
      }
    }

    return { success: true, ...results };
  }

  @Public()
  @Post('seed/quick')
  @ApiOperation({ summary: 'Quick seed with known passwords', description: 'Create seed data with known passwords (password123 for all)' })
  async quickSeed() {
    const results: any = { users: 0, tasks: 0 };

    const users = [
      { id: 'e6abcb59-0678-4a81-a2a3-ba3e057f4015', phone: '+821022098999', nickname: '관리자', role: 'admin' },
      { id: 'b6964ce2-d99f-46bb-9c39-1c3bf843369e', phone: '+821098765432', nickname: '测试用户', role: 'volunteer' },
    ];

    for (const u of users) {
      const existing = await this.userRepository.findOne({ where: { id: u.id } });
      if (!existing) {
        const user = this.userRepository.create({
          ...u,
          password: '4988dd6405a5d97a47a2a74bf81fd357', // password123
          status: 'active',
          creditScore: 100,
          pointBalance: u.role === 'admin' ? 9999 : 500,
          phoneVerified: true,
          region: 'Seoul',
        } as any);
        await this.userRepository.save(user);
        results.users++;
      }
    }

    const adminId = 'e6abcb59-0678-4a81-a2a3-ba3e057f4015';
    const taskTitles = ['社区环境清洁志愿', '敬老院慰问演出', '儿童图书馆阅读指导', '医院导诊服务', '河流清理活动'];
    for (let i = 0; i < taskTitles.length; i++) {
      const existing = await this.taskRepository.findOne({ where: { title: taskTitles[i] } });
      if (!existing) {
        const task = this.taskRepository.create({
          title: taskTitles[i],
          description: '这是一项爱心志愿服务活动，欢迎大家积极参与，传递温暖与关爱。',
          taskType: i % 2 === 0 ? 'single_once' : 'team_once',
          status: 'open',
          location: '首尔市区',
          schedule: JSON.stringify({ type: 'once', date: '2026-05-25', startTime: '09:00', endTime: '12:00' }),
          pointsReward: 50 + i * 10,
          volunteerCount: 1,
          teamSize: i % 2 === 0 ? 1 : 10,
          currentParticipants: 0,
          publisher: { id: adminId } as User,
        } as any);
        await this.taskRepository.save(task);
        results.tasks++;
      }
    }

    return results;
  }
}
