import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdCampaign, CampaignStatus, PricingModel } from './entities/ad-campaign.entity';
import { CreateAdCampaignDto, UpdateAdCampaignDto } from './dto/create-campaign.dto';
import { PublishAdDto } from './dto/publish-ad.dto';
import { AdItem } from '../ad-item/entities/ad-item.entity';

@Injectable()
export class AdCampaignService {
  constructor(
    @InjectRepository(AdCampaign)
    private readonly campaignRepo: Repository<AdCampaign>,
    @InjectRepository(AdItem)
    private readonly itemRepo: Repository<AdItem>,
  ) {}

  async findAll(advertiserId?: string): Promise<AdCampaign[]> {
    const where = advertiserId ? { advertiserId } : {};
    return this.campaignRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<AdCampaign> {
    const campaign = await this.campaignRepo.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign ${id} not found`);
    }
    return campaign;
  }

  async findActive(): Promise<AdCampaign[]> {
    return this.campaignRepo.find({
      where: { status: CampaignStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateAdCampaignDto): Promise<AdCampaign> {
    // Force status to 'pending' — all new campaigns must go through review
    const campaign = this.campaignRepo.create({
      ...dto,
      status: CampaignStatus.PENDING,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
    return this.campaignRepo.save(campaign);
  }

  async update(id: string, dto: UpdateAdCampaignDto): Promise<AdCampaign> {
    // Destructure to avoid spreading string status directly
    const { status, ...rest } = dto;
    const updateData: Partial<AdCampaign> = {
      ...rest,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };
    // Convert status string to enum if provided
    if (status) {
      updateData.status = status as CampaignStatus;
    }
    await this.campaignRepo.update(id, updateData);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: CampaignStatus): Promise<AdCampaign> {
    await this.campaignRepo.update(id, { status });
    return this.findOne(id);
  }

  async updateSpent(id: string, amount: number): Promise<void> {
    await this.campaignRepo.query(
      `UPDATE ad_campaigns SET spent = spent + $1 WHERE id = $2`,
      [amount, id],
    );
  }

  async publish(dto: PublishAdDto, advertiserId: string): Promise<AdCampaign> {
    const campaign = this.campaignRepo.create({
      advertiserId,
      name: dto.name,
      adType: dto.adType,
      status: CampaignStatus.PENDING,
      pricingModel: PricingModel.CPM,
      startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      budgetTotal: dto.budgetTotal,
      placements: dto.placementCodes,
      targeting: dto.targeting,
    });
    const saved = await this.campaignRepo.save(campaign) as AdCampaign;

    if (dto.items?.length > 0) {
      const items = dto.items.map((item, idx) =>
        this.itemRepo.create({
          campaignId: saved.id,
          imageUrl: item.imageUrl,
          landingUrl: item.landingUrl || '',
          taskId: item.taskId || null,
          rotationSeconds: item.rotationSeconds || 5,
          sortOrder: idx,
        }),
      );
      await this.itemRepo.save(items);
    }

    return this.findOne(saved.id);
  }

  async remove(id: string): Promise<void> {
    // 先删关联的 AdItem（外键约束）
    await this.itemRepo.delete({ campaignId: id });
    // 再删 campaign 本身
    await this.campaignRepo.delete(id);
  }

  /**
   * 清理脏数据：将 placements 多值数组（旧bug导致）统一为单值数组
   * 只保留第一个 placement，其余丢弃。
   * 仅管理员可调用。
   */
  async cleanupPlacements(): Promise<{ fixed: number; details: any[] }> {
    const all = await this.campaignRepo.find();
    let fixed = 0;
    const details: any[] = [];
    for (const c of all) {
      if (!c.placements || !Array.isArray(c.placements) || c.placements.length <= 1) continue;
      // 脏数据：多值数组，只保留第一个
      const kept = c.placements[0];
      const discarded = c.placements.slice(1);
      c.placements = [kept];
      await this.campaignRepo.save(c);
      fixed++;
      details.push({ id: c.id, name: c.name, kept, discarded });
    }
    return { fixed, details };
  }
}
