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
