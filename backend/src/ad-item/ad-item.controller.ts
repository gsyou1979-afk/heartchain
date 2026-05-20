import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdItemService } from './ad-item.service';
import { CreateAdItemDto, UpdateAdItemDto } from './dto/ad-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('ad/items')
export class AdItemController {
  constructor(private readonly service: AdItemService) {}

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

  /** 上传图片：接收base64数据，保存为文件，返回URL */
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
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const safeName = fileName
        ? fileName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50)
        : `ad_${timestamp}`;
      const filename = `${safeName}_${random}.${ext}`;

      // Save to uploads directory (must match static serving path in main.ts)
      const fs = await import('fs');
      const path = await import('path');
      // Use process.cwd()/uploads/ads so it's inside the static serve directory
      // (main.ts serves from __dirname/../uploads which resolves to <project>/uploads)
      const uploadDir = path.join(process.cwd(), 'uploads', 'ads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      // Return public URL
      const publicUrl = `/uploads/ads/${filename}`;

      return {
        success: true,
        url: publicUrl,
        filename,
        size: buffer.length,
      };
    } catch (error: any) {
      return { success: false, message: `Upload failed: ${error.message}` };
    }
  }
}
