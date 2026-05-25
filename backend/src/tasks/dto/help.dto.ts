import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min, Max, IsLatitude, IsLongitude } from 'class-validator';
import { HelpType } from '../entities/help-request.entity';

export class CreateHelpDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(HelpType)
  type: HelpType | string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  deadlineHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsReward?: number;

  @IsOptional()
  @IsBoolean()
  acceptPoints?: boolean;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsArray()
  images?: string[];
}

export class QueryNearbyDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  radius?: number = 5;

  @IsOptional()
  @IsNumber()
  deadlineHours?: number;

  @IsOptional()
  @IsString()
  type?: string;
}
