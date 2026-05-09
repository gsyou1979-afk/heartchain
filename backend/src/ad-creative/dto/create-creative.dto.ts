import { CreativeType } from '../entities/ad-creative.entity';

export class CreateAdCreativeDto {
  campaignId?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  landingUrl: string;
  creativeType: CreativeType;
  width?: number;
  height?: number;
}

export class UpdateAdCreativeDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  landingUrl?: string;
  width?: number;
  height?: number;
}
