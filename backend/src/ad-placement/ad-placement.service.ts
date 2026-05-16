import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdPlacement } from './entities/ad-placement.entity';
import { CreateAdPlacementDto } from './dto/create-placement.dto';
import { UpdateAdPlacementDto } from './dto/update-placement.dto';

@Injectable()
export class AdPlacementService implements OnModuleInit {
  private readonly logger = new Logger(AdPlacementService.name);

  constructor(
    @InjectRepository(AdPlacement)
    private readonly placementRepo: Repository<AdPlacement>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.placementRepo.count();
    if (count === 0) {
      this.logger.log('No ad placements found, initializing defaults...');
      await this.initDefaults();
      this.logger.log('Default ad placements initialized');
    }
  }

  async findAll(activeOnly = true): Promise<AdPlacement[]> {
    if (activeOnly) {
      return this.placementRepo.find({ where: { isActive: true } });
    }
    return this.placementRepo.find();
  }

  async findAllAdmin(): Promise<AdPlacement[]> {
    return this.placementRepo.find();
  }

  async findOne(id: string): Promise<AdPlacement> {
    return this.placementRepo.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<AdPlacement> {
    return this.placementRepo.findOne({ where: { code } });
  }

  async create(dto: CreateAdPlacementDto): Promise<AdPlacement> {
    const placement = this.placementRepo.create(dto);
    return this.placementRepo.save(placement);
  }

  async update(id: string, dto: UpdateAdPlacementDto): Promise<AdPlacement> {
    await this.placementRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.placementRepo.update(id, { isActive: false });
  }

  async initDefaults(): Promise<void> {
    const defaults = [
      { code: 'A1', name: '首页Hero横幅', description: '首页首屏导航下方轮播横幅', platform: 'web', page: 'home', position: 'hero', width: 1200, height: 400, supportedTypes: ['commercial', 'public_service', 'project'], floorCpm: 80.00, isActive: true },
      { code: 'B1', name: '左侧竖幅', description: '左侧栏顶部竖幅广告', platform: 'web', page: 'home', position: 'sidebar', width: 300, height: 600, supportedTypes: ['commercial', 'public_service'], floorCpm: 30.00, isActive: true },
      { code: 'B2', name: '左侧矩形', description: '左侧栏中部矩形广告', platform: 'web', page: 'home', position: 'sidebar', width: 300, height: 250, supportedTypes: ['commercial', 'public_service'], floorCpm: 20.00, isActive: true },
      { code: 'C1', name: '信息流原生广告1', description: '内容流中穿插原生广告', platform: 'web', page: 'home', position: 'feed', width: 580, height: 300, supportedTypes: ['commercial', 'project'], floorCpm: 0.50, isActive: true },
      { code: 'C2', name: '信息流原生广告2', description: '内容流中穿插原生广告', platform: 'web', page: 'home', position: 'feed', width: 580, height: 300, supportedTypes: ['commercial', 'project'], floorCpm: 0.50, isActive: true },
      { code: 'D1', name: '底部通栏', description: '页面底部Footer上方横幅', platform: 'web', page: 'home', position: 'footer', width: 1200, height: 150, supportedTypes: ['commercial'], floorCpm: 15.00, isActive: true },
      { code: 'MA1', name: '开屏广告', description: 'App启动时全屏广告', platform: 'android', page: 'splash', position: 'splash', width: 1080, height: 1920, supportedTypes: ['commercial'], floorCpm: 200.00, isActive: true },
      { code: 'MB1', name: '首页信息流', description: 'App首页活动列表中广告', platform: 'android', page: 'home', position: 'feed', width: 1080, height: 540, supportedTypes: ['commercial', 'public_service', 'project'], floorCpm: 0.80, isActive: true },
    ];

    for (const def of defaults) {
      const existing = await this.placementRepo.findOne({ where: { code: def.code } });
      if (!existing) {
        await this.placementRepo.save(this.placementRepo.create(def));
      } else if (!existing.isActive) {
        existing.isActive = true;
        await this.placementRepo.save(existing);
      }
    }
  }
}
