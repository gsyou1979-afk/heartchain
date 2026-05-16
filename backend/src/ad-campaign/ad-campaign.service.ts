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
    const campaign = this.campaignRepo.create({
      ...dto,
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
    await this.campaignRepo.delete(id);
  }
}
