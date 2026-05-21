import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { StorageService } from '../common/storage.service';

@Injectable()
export class MediaAssetService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly repo: Repository<MediaAsset>,
    private readonly storage: StorageService,
  ) {}

  async findAll(): Promise<MediaAsset[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<MediaAsset> {
    const asset = await this.repo.findOne({ where: { id } });
    if (!asset) throw new NotFoundException(`MediaAsset ${id} not found`);
    return asset;
  }

  async upload(
    imageData: string,
    fileName: string,
    uploaderId?: string,
  ): Promise<MediaAsset> {
    // Parse base64
    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid image data format');
    }

    const ext = matches[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const mimeType = `image/${ext}`;
    const size = buffer.length;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const safeName = fileName
      ? fileName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50)
      : `asset_${timestamp}`;
    const filename = `${safeName}_${random}`;

    let url = '';
    let storage = 'database';
    let publicId: string | null = null;

    // Try Cloudinary first
    try {
      const result = await this.storage.uploadBase64(
        imageData,
        'heartchain/assets',
        filename,
      );
      if (result) {
        url = result.url;
        publicId = result.publicId;
        storage = 'cloudinary';
      }
    } catch (e) {
      console.warn('[MediaAsset] Cloudinary upload failed, using database storage:', e);
    }

    // Fallback: store in database as base64 data URL
    if (!url) {
      url = `/api/v1/ad/media/${this.repo.create({}).id}/data`; // placeholder, will update after save
      storage = 'database';
    }

    const asset = this.repo.create({
      uploaderId: uploaderId || null,
      fileName: fileName || `${filename}.${ext}`,
      url: storage === 'database' ? '' : url,
      dataUrl: imageData, // Always store base64 in database for reliability
      mimeType,
      size,
      storage,
      publicId,
      assetType: 'image',
    });

    const saved = await this.repo.save(asset);
    // Update URL to point to database endpoint
    if (storage === 'database') {
      saved.url = `/api/v1/ad/media/${saved.id}/data`;
      return this.repo.save(saved);
    }
    return saved;
  }

  async remove(id: string): Promise<void> {
    const asset = await this.findOne(id);

    // Delete from Cloudinary if applicable
    if (asset.storage === 'cloudinary' && asset.publicId) {
      try {
        await this.storage.deleteFile(asset.publicId);
      } catch (e) {
        console.warn('[MediaAsset] Cloudinary delete failed:', e);
      }
    }

    // Delete local file if applicable
    if (asset.storage === 'local') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), asset.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {
        console.warn('[MediaAsset] Local file delete failed:', e);
      }
    }

    await this.repo.delete(id);
  }
}
