import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProjectAd,
  ProjectAdStatus,
  ProjectAdUrgency,
} from './entities/ad-project.entity';

@Injectable()
export class AdAutoGeneratorService {
  private readonly logger = new Logger(AdAutoGeneratorService.name);

  constructor(
    @InjectRepository(ProjectAd)
    private adProjectRepository: Repository<ProjectAd>,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────
  // Public API
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * 根据任务自动创建项目广告
   */
  async generateAdFromTask(task: any): Promise<ProjectAd> {
    const urgencyLevel = this.calculateUrgencyLevel(task);
    const urgency = this.urgencyLevelToEnum(urgencyLevel);
    const priorityScore = this.calculatePriorityScore(urgencyLevel, task);

    const ad = this.adProjectRepository.create({
      taskId: task.id,
      projectId: task.projectId || task.id,
      title: task.title || this.generateDefaultTitle(task),
      description: this.trimDescription(task.description),
      imageUrl: task.coverImage || task.imageUrl || '',
      landingUrl: task.detailUrl || `/tasks/${task.id}`,
      applicantName: task.applicantName || '匿名',
      applicantAvatar: task.applicantAvatar || '',
      targetAmount: task.targetAmount || 0,
      raisedAmount: task.raisedAmount || 0,
      urgency,
      urgencyLevel,
      priorityScore,
      status: ProjectAdStatus.PENDING,
      startDate: new Date(),
      endDate: task.endDate ? new Date(task.endDate) : this.calcDefaultEndDate(urgencyLevel),
      dailyBudget: 0, // 项目广告免费推广
      quotaTotal: 10000,
      quotaUsed: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
    });

    const saved = await this.adProjectRepository.save(ad);
    this.logger.log(
      `Auto-generated ad for task ${task.id} — urgency: ${urgency} (${urgencyLevel}), priority: ${priorityScore}`,
    );
    return saved;
  }

  /**
   * 批量从任务列表生成广告（已有的跳过）
   */
  async batchGenerateFromTasks(tasks: any[]): Promise<ProjectAd[]> {
    const results: ProjectAd[] = [];

    for (const task of tasks) {
      try {
        const existing = await this.adProjectRepository.findOne({
          where: { taskId: task.id },
        });
        if (!existing) {
          const ad = await this.generateAdFromTask(task);
          results.push(ad);
        }
      } catch (error) {
        this.logger.error(`Failed to generate ad for task ${task.id}:`, error);
      }
    }

    return results;
  }

  /**
   * 同步任务最新数据（金额进度、紧急程度）
   */
  async syncProjectData(taskId: string, taskData: any): Promise<void> {
    const adProject = await this.adProjectRepository.findOne({
      where: { taskId },
    });

    if (adProject) {
      const urgencyLevel = this.calculateUrgencyLevel(taskData);
      adProject.raisedAmount = taskData.raisedAmount || 0;
      adProject.urgencyLevel = urgencyLevel;
      adProject.urgency = this.urgencyLevelToEnum(urgencyLevel);
      adProject.priorityScore = this.calculatePriorityScore(urgencyLevel, taskData);
      await this.adProjectRepository.save(adProject);
    }
  }

  /**
   * 获取需要优先推广的项目广告（按 priorityScore 排序）
   */
  async getProjectsForBoost(limit = 5): Promise<ProjectAd[]> {
    return this.adProjectRepository.find({
      where: { status: ProjectAdStatus.ACTIVE },
      order: { priorityScore: 'DESC', urgencyLevel: 'DESC' },
      take: limit,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  /** 计算紧急度数值 1-5 */
  private calculateUrgencyLevel(task: any): number {
    let score = 1;

    if (task.endDate) {
      const days = this.getDaysRemaining(task.endDate);
      if (days <= 1) score += 2;
      else if (days <= 3) score += 1.5;
      else if (days <= 7) score += 1;
    }

    if (task.targetAmount) {
      if (task.targetAmount <= 5000) score += 1;
      else if (task.targetAmount <= 10000) score += 0.5;
    }

    if (task.raisedAmount && task.targetAmount) {
      const progress = task.raisedAmount / task.targetAmount;
      if (progress >= 0.9) score += 1.5;
      else if (progress <= 0.1) score += 1;
    }

    return Math.min(5, Math.max(1, Math.round(score)));
  }

  /** 数值紧急度 → 枚举 */
  private urgencyLevelToEnum(level: number): ProjectAdUrgency {
    if (level >= 4) return ProjectAdUrgency.CRITICAL;
    if (level >= 2) return ProjectAdUrgency.URGENT;
    return ProjectAdUrgency.NORMAL;
  }

  /** 计算综合优先级分数 0-100 */
  private calculatePriorityScore(urgencyLevel: number, task: any): number {
    let score = urgencyLevel * 15; // 最多 75 分
    if (task.verified) score += 10;
    if (task.isCertified) score += 15;
    return Math.min(100, score);
  }

  /** 生成默认标题 */
  private generateDefaultTitle(task: any): string {
    const typeNames: Record<string, string> = {
      medical: '医疗求助',
      education: '助学计划',
      disaster: '灾后重建',
      poverty: '扶贫帮困',
      emergency: '紧急援助',
    };
    const type = task.category || task.type || 'emergency';
    const name = task.applicantName || '求助者';
    return `${name}的${typeNames[type] || '求助'}`;
  }

  /** 裁剪描述，最多 100 字 */
  private trimDescription(desc?: string): string {
    if (!desc) return '恳请社会各界爱心人士伸出援手';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  }

  /** 根据紧急度计算默认结束日期 */
  private calcDefaultEndDate(urgencyLevel: number): Date {
    const days = urgencyLevel >= 4 ? 7 : urgencyLevel >= 3 ? 14 : 30;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  /** 距离某日期的剩余天数 */
  private getDaysRemaining(endDate: Date | string): number {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
