import { TagCategory } from '../entities/user-tag.entity';
import { IsString, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserTagDto {
  @IsString()
  userId: string;

  @IsEnum(TagCategory)
  tagCategory: TagCategory;

  @IsString()
  tagKey: string;

  @IsString()
  tagValue: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  confidence?: number;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;
}

export class BulkCreateUserTagDto {
  @IsString()
  userId: string;

  @IsArray()
  tags: Array<{
    tagCategory: TagCategory;
    tagKey: string;
    tagValue: string;
    confidence?: number;
  }>;
}

export class UserTagQueryDto {
  @IsString()
  userId: string;

  @IsEnum(TagCategory)
  @IsOptional()
  category?: TagCategory;
}
