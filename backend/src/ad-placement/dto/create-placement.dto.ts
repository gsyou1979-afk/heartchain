import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdPlacementDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['web', 'ios', 'android'])
  platform: 'web' | 'ios' | 'android';

  @IsString()
  page: string;

  @IsString()
  position: string;

  @IsNumber()
  @Type(() => Number)
  width: number;

  @IsNumber()
  @Type(() => Number)
  height: number;

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
