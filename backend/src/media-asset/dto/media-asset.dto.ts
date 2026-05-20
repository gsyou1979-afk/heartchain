export class UploadMediaDto {
  imageData: string;
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
