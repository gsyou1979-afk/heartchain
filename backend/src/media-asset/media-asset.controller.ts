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

@Controller('ad/media')
@UseGuards(JwtAuthGuard)
export class MediaAssetController {
  constructor(private readonly service: MediaAssetService) {}

  /** 获取所有素材 */
  @Get()
  async findAll() {
    const assets = await this.service.findAll();
    return assets;
  }

  /** 从数据库直接获取图片数据（base64）— 必须在 :id 路由之前 */
  @Get(':id/data')
  @Public()
  async getImageData(@Param('id') id: string, @Res() res: any) {
    const asset = await this.service.findOne(id);
    if (!asset.dataUrl) {
      return res.status(404).json({ message: 'No image data available' });
    }
    // Parse base64 data URL
    const matches = asset.dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
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

  /** 上传图片到素材库 */
  @Post('upload')
  async upload(
    @Body() dto: UploadMediaDto,
    @CurrentUser('id') userId: string,
  ) {
    const asset = await this.service.upload(dto.imageData, dto.fileName || 'asset', userId);
    return {
      success: true,
      asset,
    };
  }

  /** 删除素材 */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
