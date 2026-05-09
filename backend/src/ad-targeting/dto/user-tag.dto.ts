import { TagCategory } from '../entities/user-tag.entity';

export class CreateUserTagDto {
  userId: string;
  tagCategory: TagCategory;
  tagKey: string;
  tagValue: string;
  confidence?: number;
  source?: string;
  expiresAt?: string;
}

export class BulkCreateUserTagDto {
  userId: string;
  tags: Array<{
    tagCategory: TagCategory;
    tagKey: string;
    tagValue: string;
    confidence?: number;
  }>;
}

export class UserTagQueryDto {
  userId: string;
  category?: TagCategory;
}
