/**
 * 管理员后台服务 - 增强版
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Team } from '../teams/entities/team.entity';
import { PointTransaction } from '../points/entities/point-transaction.entity';

// 导出PointRules接口供控制器使用
export interface PointRules {
  hourlyRate: number;
  laborTypes: {
    type: string;
    multiplier: number;
  }[];
  updatedAt: string;
}

// 默认积分规则 - 与任务大厅技能列表一致
const DEFAULT_POINT_RULES: PointRules = {
  hourlyRate: 10,
  laborTypes: [
    { type: '医疗护理', multiplier: 1.0 },
    { type: '法律咨询', multiplier: 1.0 },
    { type: '教育培训', multiplier: 1.0 },
    { type: '技术开发', multiplier: 1.0 },
    { type: '设计创意', multiplier: 1.0 },
    { type: '翻译', multiplier: 1.0 },
    { type: '驾驶运输', multiplier: 1.0 },
    { type: '烹饪', multiplier: 1.0 },
    { type: '保洁', multiplier: 1.0 },
    { type: '维修', multiplier: 1.0 },
    { type: '安保', multiplier: 1.0 },
    { type: '养老护理', multiplier: 1.0 },
    { type: '育儿', multiplier: 1.0 },
    { type: '活动策划', multiplier: 1.0 },
    { type: '媒体宣传', multiplier: 1.0 },
  ],
  updatedAt: new Date().toISOString(),
};

// 简单密码哈希（使用Node内置crypto）
async function hashPassword(password: string): Promise<string> {
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(password + 'heartchain_salt').digest('hex');
}

@Injectable()
export class AdminService {
  // 内存存储积分规则（生产环境应存数据库）
  private pointRules: PointRules = { ...DEFAULT_POINT_RULES, laborTypes: [...DEFAULT_POINT_RULES.laborTypes] };

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(PointTransaction)
    private transactionRepository: Repository<PointTransaction>,
  ) {}

  // ============ 用户管理 ============

  /**
   * 获取所有用户列表（分页）
   */
  async getUsers(params: {
    page?: number;
    pageSize?: number;
    role?: UserRole;
    status?: UserStatus;
    keyword?: string;
  }) {
    const { page = 1, pageSize = 20, role, status, keyword } = params;
    const skip = (page - 1) * pageSize;

    const query = this.userRepository.createQueryBuilder('user');

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    if (keyword) {
      query.andWhere(
        '(user.phone LIKE :keyword OR user.nickname LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [users, total] = await query
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: users.map((u) => ({
        id: u.id,
        phone: u.phone,
        nickname: u.nickname,
        role: u.role,
        status: u.status,
        region: u.region,
        pointBalance: u.pointBalance || 0,
        createdAt: u.createdAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取用户详情
   */
  async getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * 批量创建用户
   */
  async batchCreateUsers(usersData: {
    phone: string;
    nickname?: string;
    password?: string;
    role?: UserRole;
  }[]) {
    const results = {
      success: [] as any[],
      failed: [] as { phone: string; reason: string }[],
    };

    for (const userData of usersData) {
      try {
        // 检查手机号是否已存在
        const existing = await this.userRepository.findOne({
          where: { phone: userData.phone },
        });

        if (existing) {
          results.failed.push({
            phone: userData.phone,
            reason: '手机号已存在',
          });
          continue;
        }

        // 创建用户
        const passwordHash = await hashPassword(userData.password || '123456');
        const user = this.userRepository.create({
          phone: userData.phone,
          nickname: userData.nickname || `用户${userData.phone.slice(-4)}`,
          password: passwordHash,
          role: userData.role || UserRole.VOLUNTEER,
          status: UserStatus.ACTIVE,
          region: 'kr',
        });

        const saved = await this.userRepository.save(user);
        results.success.push({
          id: saved.id,
          phone: saved.phone,
          nickname: saved.nickname,
          role: saved.role,
        });
      } catch (e: any) {
        results.failed.push({
          phone: userData.phone,
          reason: e.message || '创建失败',
        });
      }
    }

    return results;
  }

  /**
   * 更新用户角色
   */
  async updateUserRole(id: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('用户不存在');
    }

    user.role = role;
    await this.userRepository.save(user);

    return {
      success: true,
      message: `用户角色已更新为 ${role}`,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  /**
   * 更新用户状态
   */
  async updateUserStatus(id: string, status: UserStatus) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('用户不存在');
    }

    user.status = status;
    await this.userRepository.save(user);

    return {
      success: true,
      message: `用户状态已更新为 ${status}`,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        status: user.status,
      },
    };
  }

  /**
   * 删除/禁用用户
   */
  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('用户不存在');
    }

    user.status = UserStatus.BANNED;
    await this.userRepository.save(user);

    return {
      success: true,
      message: '用户已禁用',
    };
  }

  // ============ 任务管理 ============

  /**
   * 获取任务列表（分页）
   */
  async getTasks(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    keyword?: string;
  }) {
    const { page = 1, pageSize = 20, status, keyword } = params;
    const skip = (page - 1) * pageSize;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (keyword) {
      query.andWhere(
        '(task.title LIKE :keyword OR task.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [tasks, total] = await query
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取任务详情
   */
  async getTaskById(id: string) {
    return this.taskRepository.findOne({ where: { id } });
  }

  /**
   * 删除任务
   */
  async deleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('任务不存在');
    }

    await this.taskRepository.remove(task);

    return {
      success: true,
      message: '任务已删除',
    };
  }

  /**
   * 强制完成任务
   */
  async forceCompleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('任务不存在');
    }

    task.status = 'completed';
    await this.taskRepository.save(task);

    return {
      success: true,
      message: '任务已强制完成',
      task,
    };
  }

  // ============ 团队管理 ============

  /**
   * 获取团队列表（分页）
   */
  async getTeams(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }) {
    const { page = 1, pageSize = 20, keyword } = params;
    const skip = (page - 1) * pageSize;

    const query = this.teamRepository.createQueryBuilder('team');

    if (keyword) {
      query.andWhere('team.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    const [teams, total] = await query
      .orderBy('team.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: teams,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取团队详情
   */
  async getTeamById(id: string) {
    return this.teamRepository.findOne({ where: { id } });
  }

  /**
   * 解散团队
   */
  async dissolveTeam(id: string) {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new Error('团队不存在');
    }

    await this.teamRepository.remove(team);

    return {
      success: true,
      message: '团队已解散',
    };
  }

  // ============ 积分规则配置 ============

  /**
   * 获取积分规则配置
   */
  getPointRules(): PointRules {
    return { ...this.pointRules, laborTypes: [...this.pointRules.laborTypes] };
  }

  /**
   * 更新积分规则
   */
  updatePointRules(rules: {
    hourlyRate?: number;
    laborTypes?: { type: string; multiplier: number }[];
  }): PointRules {
    if (rules.hourlyRate !== undefined && rules.hourlyRate !== null) {
      this.pointRules.hourlyRate = Number(rules.hourlyRate);
    }
    if (rules.laborTypes && Array.isArray(rules.laborTypes) && rules.laborTypes.length > 0) {
      this.pointRules.laborTypes = rules.laborTypes
        .filter(l => l.type && l.multiplier !== undefined)
        .map(l => ({
          type: String(l.type),
          multiplier: Number(l.multiplier) || 1.0
        }));
    }
    this.pointRules.updatedAt = new Date().toISOString();

    return { ...this.pointRules, laborTypes: [...this.pointRules.laborTypes] };
  }

  // ============ 积分管理 ============

  /**
   * 获取积分交易记录（分页）
   */
  async getTransactions(params: {
    page?: number;
    pageSize?: number;
    type?: string;
  }) {
    const { page = 1, pageSize = 20, type } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (type) {
      where.type = type;
    }

    // 不加载关系，避免列名映射问题
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data: transactions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取积分统计
   */
  async getPointsStats() {
    const issuedTypes = ['task_reward', 'admin_grant', 'signup_bonus', 'daily_bonus'];
    const transferTypes = ['transfer', 'withdraw'];

    const issuedTx = await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'total')
      .where('tx.type IN (:...types)', { types: issuedTypes })
      .getRawOne();

    const transferredTx = await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(ABS(tx.amount))', 'total')
      .where('tx.type IN (:...types)', { types: transferTypes })
      .getRawOne();

    return {
      totalIssued: Number(issuedTx?.total) || 0,
      totalTransferred: Number(transferredTx?.total) || 0,
    };
  }

  // ============ 仪表盘 ============

  /**
   * 获取管理后台统计数据（含积分统计）
   */
  async getDashboardStats() {
    // 用户统计
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });
    const adminUsers = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });

    // 任务统计
    const totalTasks = await this.taskRepository.count();
    const openTasks = await this.taskRepository.count({
      where: { status: 'open' },
    });
    const completedTasks = await this.taskRepository.count({
      where: { status: 'completed' },
    });

    // 团队统计
    const totalTeams = await this.teamRepository.count();

    // 积分统计
    const pointsStats = await this.getPointsStats();

    // 积分规则
    const pointRules = this.getPointRules();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
      },
      tasks: {
        total: totalTasks,
        open: openTasks,
        completed: completedTasks,
      },
      teams: {
        total: totalTeams,
      },
      points: {
        totalIssued: pointsStats.totalIssued,
        totalTransferred: pointsStats.totalTransferred,
      },
      pointRules,
    };
  }
}
