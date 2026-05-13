import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdItem } from './entities/ad-item.entity';
import { CreateAdItemDto, UpdateAdItemDto } from './dto/ad-item.dto';

@Injectable()
export class AdItemService {
  constructor(
    @InjectRepository(AdItem)
    private readonly itemRepo: Repository<AdItem>,
  ) {}

  async findByCampaign(campaignId: string): Promise<AdItem[]> {
    return this.itemRepo.find({
      where: { campaignId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AdItem> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`AdItem ${id} not found`);
    return item;
  }

  async create(dto: CreateAdItemDto): Promise<AdItem> {
    const item = this.itemRepo.create(dto as Partial<AdItem>);
    return this.itemRepo.save(item);
  }

  async update(id: string, dto: UpdateAdItemDto): Promise<AdItem> {
    await this.itemRepo.update(id, dto as Partial<AdItem>);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.itemRepo.delete(id);
  }

  async bulkCreate(campaignId: string, items: CreateAdItemDto[]): Promise<AdItem[]> {
    // 先删除旧的全部
    await this.itemRepo.delete({ campaignId });
    if (!items || items.length === 0) return [];
    // 批量插入
    const entities = items.map((dto, idx) =>
      this.itemRepo.create({
        campaignId,
        imageUrl: dto.imageUrl,
        landingUrl: dto.landingUrl,
        taskId: dto.taskId,
        rotationSeconds: dto.rotationSeconds ?? 5,
        sortOrder: dto.sortOrder ?? idx,
      } as Partial<AdItem>),
    );
    return this.itemRepo.save(entities);
  }
}
