import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AdItemService } from './ad-item.service';
import { CreateAdItemDto, UpdateAdItemDto } from './dto/ad-item.dto';

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
}
