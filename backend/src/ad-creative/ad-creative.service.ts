import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdCreative, CreativeStatus } from './entities/ad-creative.entity';
import { CreateAdCreativeDto, UpdateAdCreativeDto } from './dto/create-creative.dto';

@Injectable()
export class AdCreativeService {
  constructor(
    @InjectRepository(AdCreative)
    private readonly creativeRepo: Repository<AdCreative>,
  ) {}

  async findAll(campaignId?: string): Promise<AdCreative[]> {
    const where = campaignId ? { campaignId } : {};
    return this.creativeRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<AdCreative> {
    const creative = await this.creativeRepo.findOne({ where: { id } });
    if (!creative) {
      throw new NotFoundException(`Creative ${id} not found`);
    }
    return creative;
  }

  async findApproved(): Promise<AdCreative[]> {
    return this.creativeRepo.find({
      where: { status: CreativeStatus.APPROVED },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateAdCreativeDto): Promise<AdCreative> {
    const creative = this.creativeRepo.create(dto);
    return this.creativeRepo.save(creative);
  }

  async update(id: string, dto: UpdateAdCreativeDto): Promise<AdCreative> {
    await this.creativeRepo.update(id, dto);
    return this.findOne(id);
  }

  async approve(id: string): Promise<AdCreative> {
    await this.creativeRepo.update(id, { status: CreativeStatus.APPROVED });
    return this.findOne(id);
  }

  async reject(id: string): Promise<AdCreative> {
    await this.creativeRepo.update(id, { status: CreativeStatus.REJECTED });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.creativeRepo.delete(id);
  }
}
