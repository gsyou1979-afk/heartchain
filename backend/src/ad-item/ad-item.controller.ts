import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdItemService } from './ad-item.service';
import { CreateAdItemDto, UpdateAdItemDto } from './dto/ad-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { StorageService } from '../common/storage.service';

@Controller('ad/items')
export class AdItemController {
  constructor(
    private readonly service: AdItemService,
    private readonly storage: StorageService,
  ) {}

  /** 按广告计划ID获取轮播图片列表 */
  @Get('campaign/:campaignId')
  async findByCampaign(@Param('campaignId') campaignId: string) {
    return this.service.findByCampaign(campaignId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAdItemDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdItemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  /** 批量保存（替换）广告计划的所有轮播图片 */
  @Post('campaign/:campaignId/bulk')
  async bulkSave(
    @Param('campaignId') campaignId: string,
    @Body() items: CreateAdItemDto[],
  ) {
    return this.service.bulkCreate(campaignId, items);
  }

  /** 上传图片：接收base64数据，上传到Cloudinary，返回CDN URL */
  @Public()
  @Post('upload')
  async uploadImage(@Body() body: { imageData: string; fileName?: string }) {
    const { imageData, fileName } = body;

    if (!imageData) {
      return { success: false, message: 'No image data provided' };
    }

    try {
      // Parse base64 data
      const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        return { success: false, message: 'Invalid image data format' };
      }

      const ext = matches[1] || 'png';
      const base64Data = imageData; // Full base64 string

      // Generate filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const safeName = fileName
        ? fileName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50)
        : `ad_${timestamp}`;
      const filename = `${safeName}_${random}`;

      // Try Cloudinary first, fall back to local storage
      const result = await this.storage.uploadBase64(base64Data, 'heartchain/ads', filename);

      if (result) {
        return {
          success: true,
          url: result.url,
          publicId: result.publicId,
          size: Buffer.from(matches[2], 'base64').length,
          storage: 'cloudinary',
        };
      }

      // Fallback: save locally (for development without Cloudinary)
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'uploads', 'ads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const buffer = Buffer.from(matches[2], 'base64');
      const localFilename = `${filename}.${ext}`;
      const filePath = path.join(uploadDir, localFilename);
      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/ads/${localFilename}`;

      return {
        success: true,
        url: publicUrl,
        filename: localFilename,
        size: buffer.length,
        storage: 'local',
      };
    } catch (error: any) {
      return { success: false, message: `Upload failed: ${error.message}` };
    }
  }
}
