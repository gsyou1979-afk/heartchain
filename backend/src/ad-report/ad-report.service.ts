import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdImpression } from '../ad-serving/entities/ad-impression.entity';
import { AdClick } from '../ad-serving/entities/ad-click.entity';
import { ProjectAdConversion } from '../ad-serving/entities/project-ad-conversion.entity';
import { ProjectAd } from '../ad-project/entities/ad-project.entity';

export interface AdStats {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions?: number;
  conversionRate?: number;
}

export interface DailyStats {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

@Injectable()
export class AdReportService {
  constructor(
    @InjectRepository(AdImpression)
    private impressionRepo: Repository<AdImpression>,
    @InjectRepository(AdClick)
    private clickRepo: Repository<AdClick>,
    @InjectRepository(ProjectAdConversion)
    private conversionRepo: Repository<ProjectAdConversion>,
    @InjectRepository(ProjectAd)
    private projectAdRepo: Repository<ProjectAd>,
  ) {}

  // Overall stats by ad type
  async getOverallStats(adType?: string): Promise<AdStats> {
    const where: any = {};
    if (adType) {
      where.adType = adType;
    }

    const impressions = await this.impressionRepo.count({ where });
    const clicks = await this.clickRepo.count({ where });

    return {
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    };
  }

  // Stats by ad type
  async getStatsByType(): Promise<Record<string, AdStats>> {
    const types = ['commercial', 'project', 'public_service'];
    const result: Record<string, AdStats> = {};

    for (const type of types) {
      result[type] = await this.getOverallStats(type);
    }

    return result;
  }

  // Stats by placement
  async getStatsByPlacement(): Promise<Record<string, AdStats>> {
    const impressions = await this.impressionRepo
      .createQueryBuilder('imp')
      .select('placementCode')
      .addSelect('COUNT(*)', 'impressions')
      .groupBy('placementCode')
      .getRawMany();

    const clicks = await this.clickRepo
      .createQueryBuilder('clk')
      .select('placementCode')
      .addSelect('COUNT(*)', 'clicks')
      .groupBy('placementCode')
      .getRawMany();

    const result: Record<string, AdStats> = {};
    
    for (const imp of impressions) {
      result[imp.placementCode] = {
        impressions: parseInt(imp.impressions),
        clicks: 0,
        ctr: 0,
      };
    }

    for (const clk of clicks) {
      if (result[clk.placementCode]) {
        result[clk.placementCode].clicks = parseInt(clk.clicks);
        result[clk.placementCode].ctr = 
          result[clk.placementCode].impressions > 0
            ? (result[clk.placementCode].clicks / result[clk.placementCode].impressions) * 100
            : 0;
      }
    }

    return result;
  }

  // Project ad specific stats
  async getProjectAdStats(projectAdId: string): Promise<AdStats> {
    const impressions = await this.impressionRepo.count({
      where: { projectAdId },
    });
    const clicks = await this.clickRepo.count({
      where: { projectAdId },
    });
    const conversions = await this.conversionRepo.find({
      where: { projectAdId },
    });

    const totalConversions = conversions.length;

    return {
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      conversions: totalConversions,
      conversionRate: clicks > 0 ? (totalConversions / clicks) * 100 : 0,
    };
  }

  // Daily stats
  async getDailyStats(days: number = 7, adType?: string): Promise<DailyStats[]> {
    const where: any = {};
    if (adType) {
      where.adType = adType;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const impressions = await this.impressionRepo
      .createQueryBuilder('imp')
      .select("DATE(createdAt)", 'date')
      .addSelect('COUNT(*)', 'impressions')
      .where('createdAt >= :startDate', { startDate })
      .groupBy("DATE(createdAt)")
      .getRawMany();

    const clicks = await this.clickRepo
      .createQueryBuilder('clk')
      .select("DATE(createdAt)", 'date')
      .addSelect('COUNT(*)', 'clicks')
      .where('createdAt >= :startDate', { startDate })
      .groupBy("DATE(createdAt)")
      .getRawMany();

    const statsMap: Record<string, DailyStats> = {};

    for (const imp of impressions) {
      statsMap[imp.date] = {
        date: imp.date,
        impressions: parseInt(imp.impressions),
        clicks: 0,
        ctr: 0,
      };
    }

    for (const clk of clicks) {
      if (statsMap[clk.date]) {
        statsMap[clk.date].clicks = parseInt(clk.clicks);
        statsMap[clk.date].ctr = 
          statsMap[clk.date].impressions > 0
            ? (statsMap[clk.date].clicks / statsMap[clk.date].impressions) * 100
            : 0;
      }
    }

    return Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date));
  }

  // Campaign stats
  async getCampaignStats(campaignId: string): Promise<AdStats> {
    const creatives = await this.clickRepo.query(
      `SELECT id FROM ad_creatives WHERE campaign_id = $1`,
      [campaignId],
    );
    const creativeIds = creatives.map((c: any) => c.id);

    if (creativeIds.length === 0) {
      return { impressions: 0, clicks: 0, ctr: 0 };
    }

    const impressions = await this.impressionRepo
      .createQueryBuilder('imp')
      .where('creativeId IN (:...creativeIds)', { creativeIds })
      .getCount();

    const clicks = await this.clickRepo
      .createQueryBuilder('clk')
      .where('creativeId IN (:...creativeIds)', { creativeIds })
      .getCount();

    return {
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    };
  }

  // Top performing project ads
  async getTopProjectAds(limit: number = 10): Promise<Array<ProjectAd & AdStats>> {
    const projectAds = await this.projectAdRepo.find({
      order: { priorityScore: 'DESC' },
      take: limit,
    });

    const result = [];
    for (const ad of projectAds) {
      const stats = await this.getProjectAdStats(ad.id);
      result.push({ ...ad, ...stats });
    }

    return result;
  }
}
