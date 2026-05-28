import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { MediaAssetService } from './media-asset.service';
import { UploadMediaDto } from './dto/media-asset.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';

@Controller('ad/media')
@UseGuards(JwtAuthGuard)
export class MediaAssetController {
  constructor(
    private readonly service: MediaAssetService,
    @InjectRepository(MediaAsset)
    private readonly mediaRepo: Repository<MediaAsset>,
  ) {}

  /** 获取所有素材 */
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  /** 从数据库直接获取图片数据（base64）— 必须在 :id 路由之前 */
  @Get(':id/data')
  @Public()
  async getImageData(@Param('id') id: string, @Res() res: any) {
    const asset = await this.service.findOne(id);
    if (!(asset as any).dataUrl) {
      return res.status(404).json({ message: 'No image data available' });
    }
    const dataUrl = (asset as any).dataUrl;
    const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ message: 'Invalid image data' });
    }
    const buffer = Buffer.from(matches[2], 'base64');
    res.setHeader('Content-Type', asset.mimeType || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  }

  /** 获取单个素材 */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /** 上传图片到素材库（直接存数据库） */
  @Post('upload')
  async upload(
    @Body() dto: UploadMediaDto,
    @CurrentUser('id') userId: string,
  ) {
    // Parse base64
    const matches = dto.imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return { success: false, message: 'Invalid image data format' };
    }
    const ext = matches[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const mimeType = `image/${ext}`;
    const size = buffer.length;

    // Check if dataUrl column exists and save
    let hasDataUrl = false;
    try {
      const result = await this.mediaRepo.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name='media_assets' AND column_name='dataUrl'"
      );
      hasDataUrl = result && result.length > 0;
    } catch (e) {
      console.warn('[MediaAsset] column check failed:', e);
    }

    // Build save data
    const saveData: any = {
      uploaderId: userId,
      fileName: dto.fileName || `asset_${Date.now()}`,
      url: '',  // Will update after save
      mimeType,
      size,
      storage: hasDataUrl ? 'database' : 'local',
      publicId: null,
      assetType: 'image',
    };

    if (hasDataUrl) {
      // Store in database: use a placeholder URL first
      saveData.url = `/api/v1/ad/media/placeholder/data`;
    } else {
      // No dataUrl column yet, use local file (may be lost on redeploy)
      try {
        const fs = await import('fs');
        const path = await import('path');
        const uploadDir = path.join(process.cwd(), 'uploads', 'assets');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const localFilename = `${saveData.fileName}_${Date.now().toString(36)}.${ext}`;
        fs.writeFileSync(path.join(uploadDir, localFilename), buffer);
        saveData.url = `/uploads/assets/${localFilename}`;
      } catch (fsErr) {
        console.warn('[MediaAsset] Local file save failed:', fsErr);
        saveData.url = '';
      }
    }

    const asset = this.mediaRepo-create(saveData);
    const saved = await this.mediaRepo.save(asset);

    // Update URL to point to data endpoint
    if (hasDataUrl) {
      saved.url = `/api/v1/ad/media/${saved.id}/data`;
      (saved as any).dataUrl = dto.imageData;
      await this.mediaRepo.save(saved);
    }

    return {
      success: true,
      asset: saved,
    };
  }

  /** 删除素材 */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
