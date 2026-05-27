import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpRequest, HelpStatus } from './entities/help-request.entity';
import { CreateHelpDto, QueryNearbyDto } from './dto/help.dto';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(HelpRequest)
    private readonly repo: Repository<HelpRequest>,
  ) {}

  async create(dto: CreateHelpDto, creatorId: string): Promise<HelpRequest> {
    const entity = this.repo.create({
      ...dto,
      creatorId,
      status: HelpStatus.OPEN,
      deadline: dto.deadlineHours
        ? new Date(Date.now() + dto.deadlineHours * 3600000)
        : null,
    });
    return this.repo.save(entity);
  }

  async findNearby(dto: QueryNearbyDto): Promise<HelpRequest[]> {
    const { lat, lng, radius, deadlineHours, type } = dto;

    const qb = this.repo.createQueryBuilder('h')
      .leftJoinAndSelect('h.creator', 'creator')
      .where('h.status = :status', { status: HelpStatus.OPEN });

    // GPS 范围筛选（Haversine 公式，单位 km）
    if (lat && lng) {
      qb.andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(h.latitude)) * cos(radians(h.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(h.latitude)))) <= :radius`,
        { lat, lng, radius: radius || 5 }
      );
    }

    // 时间筛选
    if (deadlineHours) {
      const cutoff = new Date(Date.now() + deadlineHours * 3600000);
      qb.andWhere('h.deadline <= :cutoff', { cutoff });
    }

    // 类型筛选
    if (type) {
      qb.andWhere('h.type = :type', { type });
    }

    qb.orderBy('h.createdAt', 'DESC');

    const results = await qb.getMany();

    // 计算距离并附加到结果
    return results.map(r => ({
      ...r,
      distance: this.calcDistance(lat, lng, Number(r.latitude), Number(r.longitude)),
    })).sort((a, b) => a.distance - b.distance);
  }

  async findById(id: string): Promise<HelpRequest | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['creator', 'helper'],
    });
  }

  async accept(id: string, helperId: string): Promise<HelpRequest | null> {
    const item = await this.findById(id);
    if (!item || item.status !== HelpStatus.OPEN) return null;
    item.status = HelpStatus.ACCEPTED;
    item.helperId = helperId;
    return this.repo.save(item);
  }

  private calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  }
}
