import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MediaAssetService } from './media-asset.service';
import { UploadMediaDto } from './dto/media-asset.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
