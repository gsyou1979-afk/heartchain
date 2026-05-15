import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAdPlacementDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['web', 'ios', 'android'])
  @IsOptional()
  platform?: 'web' | 'ios' | 'android';

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;

  @IsArray()
  @IsOptional()
  supportedTypes?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  floorCpm?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
