import { AdType, PricingModel } from '../entities/ad-campaign.entity';
import { IsString, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdCampaignDto {
  @IsString()
  advertiserId: string;

  @IsString()
  name: string;

  @IsEnum(AdType)
  @IsOptional()
  adType?: AdType;

  @IsEnum(PricingModel)
  pricingModel: PricingModel;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budgetDaily?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budgetTotal?: number;

  @IsString()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsOptional()
  targeting?: {
    geo?: { countries?: string[]; provinces?: string[]; cities?: string[]; schools?: string[] };
    interests?: string[];
    ageGroups?: string[];
    frequency?: { daily?: number; weekly?: number; monthly?: number };
    schedule?: { hours?: number[]; daysOfWeek?: number[] };
  };

  @IsArray()
  @IsOptional()
  placements?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  landingUrl?: string;
}

export class UpdateAdCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budgetDaily?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budgetTotal?: number;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsOptional()
  targeting?: any;

  @IsArray()
  @IsOptional()
  placements?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  landingUrl?: string;
}
