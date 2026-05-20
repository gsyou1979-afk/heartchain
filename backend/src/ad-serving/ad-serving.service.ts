import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdImpression, AdTypeEnum } from './entities/ad-impression.entity';
import { AdClick } from './entities/ad-click.entity';
import { AdFrequency } from './entities/ad-frequency.entity';
import { ProjectAdConversion, ConversionType } from './entities/project-ad-conversion.entity';
import { AdProjectService } from '../ad-project/ad-project.service';
import { AdCreativeService } from '../ad-creative/ad-creative.service';
import { AdCampaignService } from '../ad-campaign/ad-campaign.service';
import { AdPlacementService } from '../ad-placement/ad-placement.service';
import { AdItem } from '../ad-item/entities/ad-item.entity';
import { AdRequestDto, AdImpressionDto, AdClickDto, ConversionDto } from './dto/ad-request.dto';

export interface AdResponse {
  ads: Array<{
    adType: string;
    creativeId?: string;
    projectAdId?: string;
    title: string;
    description?: string;
    imageUrl: string;
    videoUrl?: string;
    landingUrl: string;
    badge: string;
    tracking: {
      impression: string;
      click: string;
    };
    source: string;
  }>;
  fallback?: {
    type: string;
    content: any;
  };
}

@Injectable()
export class AdServingService {
  constructor(
    @InjectRepository(AdImpression)
    private impressionRepo: Repository<AdImpression>,
    @InjectRepository(AdClick)
    private clickRepo: Repository<AdClick>,
    @InjectRepository(AdFrequency)
    private frequencyRepo: Repository<AdFrequency>,
    @InjectRepository(ProjectAdConversion)
    private conversionRepo: Repository<ProjectAdConversion>,
    @InjectRepository(AdItem)
    private itemRepo: Repository<AdItem>,
    private projectAdService: AdProjectService,
    private creativeService: AdCreativeService,
    private campaignService: AdCampaignService,
    private placementService: AdPlacementService,
  ) {}

  async requestAd(dto: AdRequestDto): Promise<AdResponse> {
    const placement = await this.placementService.findByCode(dto.placementCode);
    if (!placement || !placement.isActive) {
      return this.getFallbackResponse('placement_inactive');
    }

    const ads: AdResponse['ads'] = [];
    const supportedTypes = placement.supportedTypes || [];

    // 1. Check project ads (highest priority) if supported
    if (supportedTypes.includes('project')) {
      try {
        const projectAds = await this.projectAdService.findForTargeting(
          dto.geoInfo?.city,
          dto.userInterests,
        );

        // Only use project ad if it has a valid image
        const validProjectAd = projectAds.find(p => p.imageUrl && p.imageUrl.trim() !== '');
        if (validProjectAd) {
          ads.push({
            adType: 'project',
            projectAdId: validProjectAd.id,
            title: validProjectAd.title,
            description: validProjectAd.description,
            imageUrl: validProjectAd.imageUrl,
            landingUrl: validProjectAd.landingUrl,
            badge: '求助',
            tracking: {
              impression: `/api/v1/ad/impression?projectAdId=${validProjectAd.id}`,
              click: `/api/v1/ad/click?projectAdId=${validProjectAd.id}`,
            },
            source: 'project_auto',
          });
        }
      } catch (e) {
        console.warn('Project ad lookup failed:', (e as Error).message);
      }
    }

    // 2. Check commercial ads (if not filled by project ads)
    if (supportedTypes.includes('commercial') && ads.length === 0) {
      try {
        const activeCampaigns = await this.campaignService.findActive();

        // Filter campaigns that match the requested placement
        const matchingCampaigns = activeCampaigns.filter(c =>
          c.placements && Array.isArray(c.placements) && c.placements.includes(dto.placementCode)
        );

        // First try: find ALL approved creatives linked to matching campaigns (for carousel)
        if (matchingCampaigns.length > 0) {
          const approvedCreatives = await this.creativeService.findApproved();
          const matchingCampaignIds = matchingCampaigns.map(c => c.id);

          // Collect ALL matching approved creatives (not just the first)
          const matchingApproved = approvedCreatives.filter(c =>
            matchingCampaignIds.includes(c.campaign?.id || (c as any).campaignId)
          );

          for (const creative of matchingApproved) {
            if (creative.imageUrl) {
              ads.push({
                adType: 'commercial',
                creativeId: creative.id,
                title: creative.title,
                description: creative.description,
                imageUrl: creative.imageUrl,
                videoUrl: creative.videoUrl,
                landingUrl: creative.landingUrl,
                badge: '广告',
                tracking: {
                  impression: `/api/v1/ad/impression?creativeId=${creative.id}`,
                  click: `/api/v1/ad/click?creativeId=${creative.id}`,
                },
                source: 'direct',
              });
            }
          }
        }

        // Fallback: check AdItem records for matching campaigns (if no creative found)
        // Return ALL matching items from ALL matching campaigns for carousel/rotation
        if (ads.length === 0) {
          const campaignsToSearch = matchingCampaigns.length > 0 ? matchingCampaigns : activeCampaigns;
          const allItems: Array<{ item: any; campaign: any }> = [];
          for (const campaign of campaignsToSearch) {
            const items = await this.itemRepo.find({
              where: { campaignId: campaign.id },
              order: { sortOrder: 'ASC' },
            });
            for (const item of items) {
              if (item.imageUrl && !item.imageUrl.startsWith('data:')) {
                allItems.push({ item, campaign });
              }
            }
          }
          // Return ALL valid items for this placement (for carousel)
          for (const { item, campaign } of allItems) {
            ads.push({
              adType: 'commercial',
              creativeId: item.id,
              title: campaign.name,
              description: '',
              imageUrl: item.imageUrl,
              landingUrl: item.landingUrl || '/',
              badge: '广告',
              tracking: {
                impression: `/api/v1/ad/impression?creativeId=${item.id}`,
                click: `/api/v1/ad/click?creativeId=${item.id}`,
              },
              source: 'direct',
            });
          }
        }
      } catch (e) {
        console.warn('Commercial ad lookup failed:', (e as Error).message);
      }
    }

    // 3. Check public service ads (if still not filled)
    if (supportedTypes.includes('public_service') && ads.length === 0) {
      ads.push({
        adType: 'public_service',
        title: 'HeartChain 志愿服务平台',
        description: 'Join us to make a difference!',
        imageUrl: '/assets/default-public-ad.png',
        landingUrl: '/',
        badge: '公益',
        tracking: {
          impression: '/api/v1/ad/impression?adType=public_service',
          click: '/api/v1/ad/click?adType=public_service',
        },
        source: 'platform_promo',
      });
    }

    // Return fallback if no ads available
    if (ads.length === 0) {
      return this.getFallbackResponse('no_ads');
    }

    return { ads };
  }

  async reportImpression(dto: AdImpressionDto): Promise<{ impressionId: string }> {
    // Check frequency cap
    if (dto.userId) {
      const capped = await this.checkFrequencyCap(dto.userId, dto.adType, dto.creativeId, dto.projectAdId);
      if (capped) {
        return { impressionId: 'blocked_by_frequency_cap' };
      }
    }

    const impression = this.impressionRepo.create({
      adType: dto.adType as AdTypeEnum,
      creativeId: dto.creativeId,
      projectAdId: dto.projectAdId,
      placementCode: dto.placementCode,
      userId: dto.userId,
      deviceId: dto.deviceId,
      geoCity: dto.geoInfo?.city,
      geoSchool: dto.geoInfo?.school,
      isViewable: dto.viewPercentage ? dto.viewPercentage >= 50 : false,
      viewDuration: dto.viewDuration,
      source: dto.adType === 'project' ? 'project_auto' : 'direct',
    });

    const saved = await this.impressionRepo.save(impression);

    // Update frequency
    if (dto.userId) {
      await this.updateFrequency(dto.userId, dto.adType, dto.creativeId, dto.projectAdId);
    }

    // Update project ad quota if it's a project ad
    if (dto.projectAdId) {
      await this.projectAdService.incrementQuotaUsed(dto.projectAdId);
    }

    return { impressionId: String(saved.id) };
  }

  async reportClick(dto: AdClickDto): Promise<void> {
    const click = this.clickRepo.create({
      adType: dto.adType as AdTypeEnum,
      creativeId: dto.creativeId,
      projectAdId: dto.projectAdId,
      placementCode: dto.placementCode,
      userId: dto.userId,
      impressionId: dto.impressionId,
    });

    await this.clickRepo.save(click);

    // Update frequency clicks
    if (dto.userId) {
      await this.updateFrequency(dto.userId, dto.adType, dto.creativeId, dto.projectAdId, true);
    }
  }

  async reportConversion(dto: ConversionDto): Promise<void> {
    const conversion = this.conversionRepo.create({
      projectAdId: dto.projectAdId,
      impressionId: dto.impressionId,
      clickId: dto.clickId,
      userId: dto.userId,
      conversionType: dto.conversionType as ConversionType,
    });

    await this.conversionRepo.save(conversion);
  }

  private async checkFrequencyCap(
    userId: string,
    adType: string,
    creativeId?: string,
    projectAdId?: string,
  ): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    
    const freq = await this.frequencyRepo.findOne({
      where: {
        userId,
        creativeId: creativeId || undefined,
        projectAdId: projectAdId || undefined,
        date: new Date(today),
      },
    });

    if (!freq) return false;

    // Different caps per ad type
    const caps: Record<string, number> = {
      project: 8,
      commercial: 5,
      public_service: 10,
    };

    return freq.impressions >= (caps[adType] || 5);
  }

  private async updateFrequency(
    userId: string,
    adType: string,
    creativeId?: string,
    projectAdId?: string,
    isClick: boolean = false,
  ): Promise<void> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    let freq = await this.frequencyRepo.findOne({
      where: {
        userId,
        creativeId: creativeId || undefined,
        projectAdId: projectAdId || undefined,
        date: new Date(dateStr),
      },
    });

    if (!freq) {
      freq = this.frequencyRepo.create({
        userId,
        adType,
        creativeId,
        projectAdId,
        date: new Date(dateStr),
        impressions: 0,
        clicks: 0,
      });
    }

    if (isClick) {
      freq.clicks += 1;
    } else {
      freq.impressions += 1;
    }

    await this.frequencyRepo.save(freq);
  }

  private getFallbackResponse(reason: string): AdResponse {
    return {
      ads: [],
      fallback: {
        type: 'platform_promo',
        content: {
          title: 'HeartChain 志愿服务平台',
          description: 'Join our volunteer community and make a difference!',
          imageUrl: '/assets/default-public-ad.png',
          landingUrl: '/',
        },
      },
    };
  }
}
