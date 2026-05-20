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
    await this.migrateOldPlacements();
    await this.initDefaults();
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
    await this.placementRepo.delete(id);
  }

  /**
   * 迁移旧数据到新的广告位体系
   * 根据 code 来识别和修复，不依赖 position 值
   */
  private async migrateOldPlacements(): Promise<void> {
    this.logger.log('Starting placement migration...');

    // 1. 先清理错误的 A2/A3（如果存在且 position 不对）
    const existingA2 = await this.placementRepo.findOne({ where: { code: 'A2' } });
    if (existingA2 && existingA2.position !== 'left-top') {
      this.logger.log(`Removing incorrect A2 (position=${existingA2.position})`);
      await this.placementRepo.delete(existingA2.id);
    }
    const existingA3 = await this.placementRepo.findOne({ where: { code: 'A3' } });
    if (existingA3 && existingA3.position !== 'left-bottom') {
      this.logger.log(`Removing incorrect A3 (position=${existingA3.position})`);
      await this.placementRepo.delete(existingA3.id);
    }

    // 2. B1 → A2 (左侧-上)
    const b1 = await this.placementRepo.findOne({ where: { code: 'B1' } });
    if (b1) {
      b1.code = 'A2';
      b1.name = '左侧-上';
      b1.position = 'left-top';
      b1.width = 300;
      b1.height = 250;
      b1.description = '左侧边栏上方广告';
      b1.supportedTypes = ['commercial', 'public_service'];
      b1.floorCpm = 30.00;
      await this.placementRepo.save(b1);
      this.logger.log('Migrated B1 → A2 (left-top 300x250)');
    }

    // 3. B2 → A3 (左侧-下)
    const b2 = await this.placementRepo.findOne({ where: { code: 'B2' } });
    if (b2) {
      b2.code = 'A3';
      b2.name = '左侧-下';
      b2.position = 'left-bottom';
      b2.width = 300;
      b2.height = 250;
      b2.description = '左侧边栏下方广告';
      b2.supportedTypes = ['commercial', 'public_service'];
      b2.floorCpm = 20.00;
      await this.placementRepo.save(b2);
      this.logger.log('Migrated B2 → A3 (left-bottom 300x250)');
    }

    // 4. 修复 A1: position 应该是 hero，尺寸 1200x400
    const a1 = await this.placementRepo.findOne({ where: { code: 'A1' } });
    if (a1) {
      let changed = false;
      if (a1.position !== 'hero') { a1.position = 'hero'; changed = true; }
      if (a1.width !== 1200) { a1.width = 1200; changed = true; }
      if (a1.height !== 400) { a1.height = 400; changed = true; }
      if (changed) {
        await this.placementRepo.save(a1);
        this.logger.log('Fixed A1: position=hero, 1200x400');
      }
    }

    // 5. 修复 D1: position 应该是 footer，尺寸 1200x150
    const d1 = await this.placementRepo.findOne({ where: { code: 'D1' } });
    if (d1) {
      let changed = false;
      if (d1.position !== 'footer') { d1.position = 'footer'; changed = true; }
      if (d1.width !== 1200) { d1.width = 1200; changed = true; }
      if (d1.height !== 150) { d1.height = 150; changed = true; }
      if (changed) {
        await this.placementRepo.save(d1);
        this.logger.log('Fixed D1: position=footer, 1200x150');
      }
    }

    // 6. 修复 C1/C2: position 应该是 feed
    for (const code of ['C1', 'C2']) {
      const c = await this.placementRepo.findOne({ where: { code } });
      if (c && c.position !== 'feed') {
        c.position = 'feed';
        await this.placementRepo.save(c);
        this.logger.log(`Fixed ${code}: position=feed`);
      }
    }

    this.logger.log('Placement migration completed');
  }

  async initDefaults(): Promise<void> {
    const defaults = [
      { code: 'A1', name: '首页Hero横幅', description: '首页首屏导航下方轮播横幅', platform: 'web', page: 'home', position: 'hero', width: 1200, height: 400, supportedTypes: ['commercial', 'public_service', 'project'], floorCpm: 80.00, isActive: true },
      { code: 'D1', name: '底部通栏', description: '页面底部Footer上方横幅', platform: 'web', page: 'home', position: 'footer', width: 1200, height: 150, supportedTypes: ['commercial'], floorCpm: 15.00, isActive: true },
      { code: 'A2', name: '左侧-上', description: '左侧边栏上方广告', platform: 'web', page: 'home', position: 'left-top', width: 300, height: 250, supportedTypes: ['commercial', 'public_service'], floorCpm: 30.00, isActive: true },
      { code: 'A3', name: '左侧-下', description: '左侧边栏下方广告', platform: 'web', page: 'home', position: 'left-bottom', width: 300, height: 250, supportedTypes: ['commercial', 'public_service'], floorCpm: 20.00, isActive: true },
      { code: 'C1', name: '信息流原生广告1', description: '内容流中穿插原生广告', platform: 'web', page: 'home', position: 'feed', width: 580, height: 300, supportedTypes: ['commercial', 'project'], floorCpm: 0.50, isActive: true },
      { code: 'C2', name: '信息流原生广告2', description: '内容流中穿插原生广告', platform: 'web', page: 'home', position: 'feed', width: 580, height: 300, supportedTypes: ['commercial', 'project'], floorCpm: 0.50, isActive: true },
      { code: 'MA1', name: '开屏广告', description: 'App启动时全屏广告', platform: 'android', page: 'splash', position: 'splash', width: 1080, height: 1920, supportedTypes: ['commercial'], floorCpm: 200.00, isActive: true },
      { code: 'MB1', name: '首页信息流', description: 'App首页活动列表中广告', platform: 'android', page: 'home', position: 'feed', width: 1080, height: 540, supportedTypes: ['commercial', 'public_service', 'project'], floorCpm: 0.80, isActive: true },
    ];

    for (const def of defaults) {
      const existing = await this.placementRepo.findOne({ where: { code: def.code } });
      if (!existing) {
        await this.placementRepo.save(this.placementRepo.create(def));
        this.logger.log(`Created placement: ${def.code}`);
      } else if (!existing.isActive) {
        existing.isActive = true;
        await this.placementRepo.save(existing);
        this.logger.log(`Reactivated placement: ${def.code}`);
      }
    }
  }
}
