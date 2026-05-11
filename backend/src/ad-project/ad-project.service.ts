import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectAd, ProjectAdStatus, ProjectAdUrgency } from './entities/ad-project.entity';
import { GenerateProjectAdDto, UpdateProjectAdDto } from './dto/generate-project-ad.dto';

@Injectable()
export class AdProjectService {
  constructor(
    @InjectRepository(ProjectAd)
    private readonly projectAdRepo: Repository<ProjectAd>,
  ) {}

  async findAll(status?: ProjectAdStatus): Promise<ProjectAd[]> {
    const where = status ? { status } : {};
    return this.projectAdRepo.find({ where, order: { priorityScore: 'DESC', createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ProjectAd> {
    const projectAd = await this.projectAdRepo.findOne({ where: { id } });
    if (!projectAd) {
      throw new NotFoundException(`ProjectAd ${id} not found`);
    }
    return projectAd;
  }

  async findByProjectId(projectId: string): Promise<ProjectAd> {
    return this.projectAdRepo.findOne({ where: { projectId } });
  }

  async findActive(limit: number = 10): Promise<ProjectAd[]> {
    return this.projectAdRepo.find({
      where: { status: ProjectAdStatus.ACTIVE },
      order: { priorityScore: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async findForTargeting(geoCity?: string, interests?: string[]): Promise<ProjectAd[]> {
    const qb = this.projectAdRepo
      .createQueryBuilder('pa')
      .where('pa.status = :status', { status: ProjectAdStatus.ACTIVE })
      .andWhere('pa.quotaUsed < pa.quotaTotal');

    if (geoCity) {
      qb.andWhere("(pa.geoTarget->>'city' = :city OR pa.geoTarget->>'province' = :province)", { city: geoCity, province: geoCity });
    }

    if (interests && interests.length > 0) {
      qb.andWhere('pa.interestTarget && ARRAY[:...interests]::varchar[]', { interests });
    }

    return qb
      .orderBy('pa.urgency', 'DESC')
      .addOrderBy('pa.priorityScore', 'DESC')
      .take(10)
      .getMany();
  }

  async generate(projectId: string, dto: GenerateProjectAdDto): Promise<ProjectAd> {
    // Auto-generate ad from project
    const title = dto.title.substring(0, 20);
    const description = dto.description ? dto.description.substring(0, 50) : null;
    const imageUrl = dto.coverImage || '/assets/default-project-ad.png';
    const landingUrl = `/project/${dto.projectId}`;

    // Auto-infer geo targeting
    const geoTarget = dto.geoLocation ? {
      city: dto.geoLocation.city,
      school: dto.geoLocation.school,
      lat: dto.geoLocation.lat,
      lng: dto.geoLocation.lng,
    } : null;

    // Auto-infer interest targeting from category
    const interestTarget = dto.category ? [dto.category] : [];

    // Calculate initial priority score (higher for urgent)
    const priorityScore = dto.urgency === ProjectAdUrgency.URGENT ? 100 : 50;

    const projectAd = this.projectAdRepo.create({
      projectId,
      title,
      description,
      imageUrl,
      landingUrl,
      geoTarget,
      interestTarget,
      priorityScore,
      urgency: dto.urgency || ProjectAdUrgency.NORMAL,
      quotaTotal: 10000,
      quotaUsed: 0,
      status: ProjectAdStatus.ACTIVE,
    });

    return this.projectAdRepo.save(projectAd);
  }

  async update(id: string, dto: UpdateProjectAdDto): Promise<ProjectAd> {
    // Destructure to avoid spreading string status directly
    const { status, ...rest } = dto;
    const updateData: Partial<ProjectAd> = { ...rest };
    // Convert status string to enum if provided
    if (status) {
      updateData.status = status as ProjectAdStatus;
    }
    await this.projectAdRepo.update(id, updateData);
    return this.findOne(id);
  }

  async incrementQuotaUsed(id: string, count: number = 1): Promise<void> {
    await this.projectAdRepo.query(
      `UPDATE project_ads SET quota_used = quota_used + $1, updated_at = NOW() WHERE id = $2`,
      [count, id],
    );
  }

  async pause(id: string): Promise<ProjectAd> {
    await this.projectAdRepo.update(id, { status: ProjectAdStatus.PAUSED });
    return this.findOne(id);
  }

  async resume(id: string): Promise<ProjectAd> {
    await this.projectAdRepo.update(id, { status: ProjectAdStatus.ACTIVE });
    return this.findOne(id);
  }

  async updateStatus(id: string, status: ProjectAdStatus): Promise<ProjectAd> {
    await this.projectAdRepo.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.projectAdRepo.delete(id);
  }

  async initAdSlots(): Promise<{ created: number; message: string }> {
    const existing = await this.projectAdRepo.count();
    if (existing > 0) {
      return { created: 0, message: `已有 ${existing} 个广告位，跳过初始化` };
    }

    // 定义8个广告位
    const slots = [
      { position: 'A1', title: '首页顶部横幅', landingUrl: '/', priorityScore: 100 },
      { position: 'A2', title: '首页中部横栏', landingUrl: '/', priorityScore: 90 },
      { position: 'A3', title: '首页底部横幅', landingUrl: '/', priorityScore: 80 },
      { position: 'B1', title: '任务列表页左侧', landingUrl: '/tasks', priorityScore: 70 },
      { position: 'B2', title: '任务详情页顶部', landingUrl: '/mytasks', priorityScore: 60 },
      { position: 'B3', title: '志愿者页侧栏', landingUrl: '/volunteer', priorityScore: 50 },
      { position: 'C1', title: '个人中心页中栏', landingUrl: '/profile', priorityScore: 40 },
      { position: 'C2', title: '捐赠页横幅', landingUrl: '/donate', priorityScore: 30 },
    ];

    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    for (const slot of slots) {
      const ad = this.projectAdRepo.create({
        slotPosition: slot.position,
        title: slot.title,
        description: '等待填充内容',
        imageUrl: '/assets/default-ad-placeholder.png',
        landingUrl: slot.landingUrl,
        applicantName: '系统管理员',
        targetAmount: 0,
        raisedAmount: 0,
        urgency: ProjectAdUrgency.NORMAL,
        urgencyLevel: 1,
        priorityScore: slot.priorityScore,
        startDate: now,
        endDate: endDate,
        quotaTotal: 0,
        quotaUsed: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        status: ProjectAdStatus.PAUSED, // 默认暂停，等待填充内容
      });
      await this.projectAdRepo.save(ad);
    }

    return { created: slots.length, message: `成功初始化 ${slots.length} 个广告位` };
  }

  async seedVolunteerAds(): Promise<{ created: number; message: string }> {
    // 检查是否已有数据
    const existing = await this.projectAdRepo.count();
    if (existing > 0) {
      return { created: 0, message: `已存在 ${existing} 个广告，跳过` };
    }

    const baseUrl = 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads';

    const ads = [
      {
        title: '传递爱心，温暖世界',
        description: '伸出援助之手，让爱心传递到每一个角落。韩国志愿者服务，用行动温暖需要帮助的人。',
        imageUrl: `${baseUrl}/Korean_volunteers_donating_foo_2026-05-10T15-41-29.png`,
        landingUrl: '/volunteer',
        urgency: ProjectAdUrgency.NORMAL,
        urgencyLevel: 2,
        priorityScore: 20,
      },
      {
        title: '志愿同行，让爱传递',
        description: '与志愿者同行，用爱心点亮希望。韩国青年志愿服务队，欢迎您的加入！',
        imageUrl: `${baseUrl}/Korean_youth_volunteers_planti_2026-05-10T15-40-48.png`,
        landingUrl: '/mytasks',
        urgency: ProjectAdUrgency.NORMAL,
        urgencyLevel: 1,
        priorityScore: 10,
      },
      {
        title: '小行动，大爱心',
        description: '每一个小行动，都是大爱心的体现。韩国志愿者，用平凡成就非凡。',
        imageUrl: `${baseUrl}/Korean_volunteers_tutoring_chi_2026-05-10T15-42-33.png`,
        landingUrl: '/tasks',
        urgency: ProjectAdUrgency.URGENT,
        urgencyLevel: 2,
        priorityScore: 25,
      },
      {
        title: '用爱温暖每一位需要的人',
        description: '韩国老年人关怀志愿服务，为独居老人送去温暖与陪伴。',
        imageUrl: `${baseUrl}/Korean_elderly_volunteers_c_2026-05-10T15-40-25.png`,
        landingUrl: '/tasks',
        urgency: ProjectAdUrgency.CRITICAL,
        urgencyLevel: 3,
        priorityScore: 30,
      },
      {
        title: '爱心让世界更美丽',
        description: '灾害救援志愿服务，关键时刻伸出援手。韩国救灾志愿者队伍随时待命。',
        imageUrl: `${baseUrl}/Korean_disaster_volunteers_r_2026-05-10T15-40-37.png`,
        landingUrl: '/tasks',
        urgency: ProjectAdUrgency.CRITICAL,
        urgencyLevel: 3,
        priorityScore: 30,
      },
      {
        title: '伸出援手，让爱发光',
        description: '社区志愿服务，从身边做起。韩国各地志愿者团队，欢迎您的参与。',
        imageUrl: `${baseUrl}/Korean_environmental_cleanup_2026-05-10T15-42-16.png`,
        landingUrl: '/tasks',
        urgency: ProjectAdUrgency.NORMAL,
        urgencyLevel: 1,
        priorityScore: 10,
      },
      {
        title: '一人帮人人，人人互帮',
        description: '志愿服务是一种生活方式。韩国志愿者，在付出中获得成长与快乐。',
        imageUrl: `${baseUrl}/Korean_blood_donation_volu_2026-05-10T15-41-50.png`,
        landingUrl: '/volunteer',
        urgency: ProjectAdUrgency.URGENT,
        urgencyLevel: 2,
        priorityScore: 25,
      },
    ];

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 6);

    const results = { created: 0, errors: 0 };
    for (const ad of ads) {
      try {
        const projectAd = this.projectAdRepo.create({
          title: ad.title,
          description: ad.description,
          imageUrl: ad.imageUrl,
          landingUrl: ad.landingUrl,
          applicantName: '系统管理员',
          targetAmount: 1000000,
          raisedAmount: 0,
          urgency: ad.urgency,
          urgencyLevel: ad.urgencyLevel,
          priorityScore: ad.priorityScore,
          startDate: now,
          endDate: endDate,
          quotaTotal: 100000,
          quotaUsed: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          status: ProjectAdStatus.ACTIVE,
        });
        await this.projectAdRepo.save(projectAd);
        results.created++;
      } catch (e) {
        console.error('广告创建失败:', ad.title, e);
        results.errors++;
      }
    }

    return { created: results.created, message: `成功创建 ${results.created} 个广告${results.errors > 0 ? '，失败 ' + results.errors + ' 个' : ''}` };
  }

  async quickSeedAds(): Promise<{ created: number; message: string }> {
    const existing = await this.projectAdRepo.count();
    if (existing > 0) {
      return { created: 0, message: `已存在 ${existing} 个广告，跳过` };
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 6);

    const ads = [
      { title: '传递爱心，温暖世界', description: '伸出援助之手，让爱心传递到每一个角落。', priorityScore: 20 },
      { title: '志愿同行，让爱传递', description: '与志愿者同行，用爱心点亮希望。', priorityScore: 15 },
      { title: '小行动，大爱心', description: '每一个小行动，都是大爱心的体现。', priorityScore: 25 },
      { title: '用爱温暖每一位需要的人', description: '韩国老年人关怀志愿服务，为独居老人送去温暖。', priorityScore: 30 },
      { title: '爱心让世界更美丽', description: '灾害救援志愿服务，关键时刻伸出援手。', priorityScore: 30 },
      { title: '伸出援手，让爱发光', description: '社区志愿服务，从身边做起。', priorityScore: 10 },
      { title: '一人帮人人，人人互帮', description: '志愿服务是一种生活方式。', priorityScore: 25 },
    ];

    const bgColors = ['from-red-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500',
      'from-purple-500 to-violet-500', 'from-orange-500 to-amber-500', 'from-teal-500 to-cyan-500', 'from-rose-500 to-pink-500'];
    const emojis = ['❤️', '🤝', '💪', '🌍', '💖', '🙏', '✨'];

    let created = 0;
    for (let i = 0; i < ads.length; i++) {
      const ad = ads[i];
      try {
        const projectAd = this.projectAdRepo.create({
          title: ad.title,
          description: ad.description,
          imageUrl: '',
          landingUrl: '/tasks',
          applicantName: '系统管理员',
          targetAmount: 1000000,
          raisedAmount: 0,
          urgency: ProjectAdUrgency.NORMAL,
          urgencyLevel: 1,
          priorityScore: ad.priorityScore,
          startDate: now,
          endDate: endDate,
          quotaTotal: 100000,
          quotaUsed: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          status: ProjectAdStatus.ACTIVE,
        });
        await this.projectAdRepo.save(projectAd);
        created++;
      } catch (e) {
        console.error('quickSeed失败:', ad.title, e);
      }
    }

    return { created, message: `快速创建 ${created} 个广告（无图片）` };
  }

  // Match score calculation for targeting
  calculateMatchScore(
    projectAd: ProjectAd,
    userGeo: { city?: string; school?: string },
    userInterests: string[],
    isUrgent: boolean = false,
  ): number {
    let score = 0;

    // Geo match score
    if (projectAd.geoTarget) {
      if (projectAd.geoTarget.school && userGeo.school === projectAd.geoTarget.school) {
        score += 40; // Same school = highest
      } else if (projectAd.geoTarget.city && userGeo.city === projectAd.geoTarget.city) {
        score += 32; // Same city
      }
    }

    // Interest match score
    if (projectAd.interestTarget && userInterests.length > 0) {
      const overlap = projectAd.interestTarget.filter(i => userInterests.includes(i)).length;
      score += overlap * 15;
    }

    // Urgency bonus
    if (projectAd.urgency === ProjectAdUrgency.URGENT || isUrgent) {
      score += 20;
    }

    // Quota remaining bonus (prefer ads with more quota remaining)
    const quotaRemaining = projectAd.quotaTotal - projectAd.quotaUsed;
    if (quotaRemaining > 5000) {
      score += 10;
    } else if (quotaRemaining > 1000) {
      score += 5;
    }

    return score;
  }
}
