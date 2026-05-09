import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTag, TagCategory, TagSource } from './entities/user-tag.entity';
import { CreateUserTagDto, BulkCreateUserTagDto } from './dto/user-tag.dto';

@Injectable()
export class AdTargetingService {
  constructor(
    @InjectRepository(UserTag)
    private readonly tagRepo: Repository<UserTag>,
  ) {}

  async findByUser(userId: string, category?: TagCategory): Promise<UserTag[]> {
    const where: any = { userId };
    if (category) {
      where.tagCategory = category;
    }
    return this.tagRepo.find({ where });
  }

  async getUserTagValues(userId: string): Promise<{
    geo: string[];
    interests: string[];
    serviceExperience: string[];
    behavior: string[];
  }> {
    const tags = await this.tagRepo.find({ where: { userId } });
    
    const result = {
      geo: [] as string[],
      interests: [] as string[],
      serviceExperience: [] as string[],
      behavior: [] as string[],
    };

    for (const tag of tags) {
      switch (tag.tagCategory) {
        case TagCategory.GEO:
          result.geo.push(tag.tagValue);
          break;
        case TagCategory.INTEREST:
          result.interests.push(tag.tagValue);
          break;
        case TagCategory.SERVICE_EXPERIENCE:
          result.serviceExperience.push(tag.tagValue);
          break;
        case TagCategory.BEHAVIOR:
          result.behavior.push(tag.tagValue);
          break;
      }
    }

    return result;
  }

  async create(dto: CreateUserTagDto): Promise<UserTag> {
    const { expiresAt, source, ...rest } = dto;
    const tag = this.tagRepo.create({
      ...rest,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      source: source as TagSource,
    });
    return this.tagRepo.save(tag);
  }

  async bulkCreate(dto: BulkCreateUserTagDto): Promise<UserTag[]> {
    const tags = dto.tags.map(t => this.tagRepo.create({
      userId: dto.userId,
      tagCategory: t.tagCategory,
      tagKey: t.tagKey,
      tagValue: t.tagValue,
      confidence: t.confidence || 1.0,
      source: TagSource.INFERRED,
    }));

    // Delete existing tags for user first
    await this.tagRepo.delete({ userId: dto.userId });
    
    return this.tagRepo.save(tags);
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.tagRepo.delete({ userId });
  }

  // Auto-generate tags from user behavior
  async generateTagsFromActivity(userId: string, activity: {
    type: string;
    category?: string;
    city?: string;
    school?: string;
  }): Promise<void> {
    const tags: Partial<UserTag>[] = [];

    // Geo tags
    if (activity.city) {
      tags.push({
        userId,
        tagCategory: TagCategory.GEO,
        tagKey: 'city',
        tagValue: activity.city,
        confidence: 0.9,
        source: TagSource.INFERRED,
      });
    }

    if (activity.school) {
      tags.push({
        userId,
        tagCategory: TagCategory.GEO,
        tagKey: 'school',
        tagValue: activity.school,
        confidence: 0.95,
        source: TagSource.REGISTRATION,
      });
    }

    // Interest tags from activity type
    if (activity.category) {
      tags.push({
        userId,
        tagCategory: TagCategory.INTEREST,
        tagKey: activity.type,
        tagValue: activity.category,
        confidence: 0.7,
        source: TagSource.INFERRED,
      });
    }

    // Service experience tags
    if (activity.type === 'volunteer' && activity.category) {
      tags.push({
        userId,
        tagCategory: TagCategory.SERVICE_EXPERIENCE,
        tagKey: 'service_type',
        tagValue: activity.category,
        confidence: 0.85,
        source: TagSource.INFERRED,
      });
    }

    for (const tag of tags) {
      const existing = await this.tagRepo.findOne({
        where: {
          userId: tag.userId,
          tagKey: tag.tagKey,
          tagValue: tag.tagValue,
        },
      });

      if (!existing) {
        await this.tagRepo.save(this.tagRepo.create(tag));
      }
    }
  }

  // Get users by tag targeting
  async findUsersByTags(tagCriteria: Array<{
    tagKey: string;
    tagValue: string;
  }>): Promise<string[]> {
    const userIds: string[] = [];

    for (const criteria of tagCriteria) {
      const tags = await this.tagRepo.find({
        where: {
          tagKey: criteria.tagKey,
          tagValue: criteria.tagValue,
        },
      });
      userIds.push(...tags.map(t => t.userId));
    }

    return [...new Set(userIds)];
  }
}
