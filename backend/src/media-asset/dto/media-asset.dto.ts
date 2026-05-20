import { IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  imageData: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}

export class MediaAssetResponse {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  storage: string;
  assetType: string;
  createdAt: Date;
}
