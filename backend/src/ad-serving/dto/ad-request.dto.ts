import { IsString, IsOptional, IsNumber, IsIn, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class AdRequestDto {
  @IsString()
  placementCode: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  deviceId: string;

  @IsIn(['web', 'ios', 'android'])
  platform: 'web' | 'ios' | 'android';

  @IsString()
  @IsOptional()
  pageUrl?: string;

  @IsObject()
  @IsOptional()
  geoInfo?: {
    country?: string;
    province?: string;
    city?: string;
    school?: string;
    lat?: number;
    lng?: number;
  };

  @IsArray()
  @IsOptional()
  userInterests?: string[];
}

export class AdImpressionDto {
  @IsString()
  adType: string;

  @IsString()
  @IsOptional()
  creativeId?: string;

  @IsString()
  @IsOptional()
  projectAdId?: string;

  @IsString()
  placementCode: string;

  @IsString()
  @IsOptional()
  impressionId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  deviceId: string;

  @IsObject()
  @IsOptional()
  geoInfo?: {
    country?: string;
    province?: string;
    city?: string;
    school?: string;
    lat?: number;
    lng?: number;
  };

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  viewDuration?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  viewPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  timestamp?: number;
}

export class AdClickDto {
  @IsString()
  adType: string;

  @IsString()
  @IsOptional()
  creativeId?: string;

  @IsString()
  @IsOptional()
  projectAdId?: string;

  @IsString()
  placementCode: string;

  @IsString()
  impressionId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  deviceId: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  timestamp?: number;
}

export class ConversionDto {
  @IsString()
  projectAdId: string;

  @IsString()
  @IsOptional()
  clickId?: string;

  @IsString()
  @IsOptional()
  impressionId?: string;

  @IsString()
  userId: string;

  @IsIn(['sign_up', 'donate', 'share'])
  conversionType: 'sign_up' | 'donate' | 'share';

  @IsNumber()
  timestamp: number;
}
