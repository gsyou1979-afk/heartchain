import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdItemDto {
  @IsString()
  campaignId: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  landingUrl?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  rotationSeconds?: number = 5;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number = 0;
}

export class UpdateAdItemDto {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  landingUrl?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  rotationSeconds?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;
}
