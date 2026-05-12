import { ProjectAdUrgency } from '../entities/ad-project.entity';
import { IsString, IsOptional, IsNumber, IsEnum, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateProjectAdDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsObject()
  @IsOptional()
  geoLocation?: {
    city: string;
    school?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsEnum(ProjectAdUrgency)
  @IsOptional()
  urgency?: ProjectAdUrgency;
}

export class UpdateProjectAdDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsObject()
  @IsOptional()
  geoTarget?: any;

  @IsArray()
  @IsOptional()
  interestTarget?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priorityScore?: number;

  @IsEnum(ProjectAdUrgency)
  @IsOptional()
  urgency?: ProjectAdUrgency;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quotaTotal?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
