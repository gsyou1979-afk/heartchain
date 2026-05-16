import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AdType } from '../entities/ad-campaign.entity';

export class AdItemDto {
  @IsString()
  imageUrl: string;

  @IsString()
  @IsOptional()
  landingUrl?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsNumber()
  @IsOptional()
  rotationSeconds?: number = 5;
}

export class PublishAdDto {
  @IsString()
  name: string;

  @IsEnum(AdType)
  adType: AdType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  placementCodes: string[];

  @ValidateNested({ each: true })
  @Type(() => AdItemDto)
  items: AdItemDto[];

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  budgetTotal?: number;

  @IsOptional()
  targeting?: {
    geo?: { cities?: string[]; schools?: string[] };
    schedule?: { hours?: number[]; daysOfWeek?: number[] };
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
