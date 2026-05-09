import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdCampaignService } from './ad-campaign.service';
import { CreateAdCampaignDto, UpdateAdCampaignDto } from './dto/create-campaign.dto';
import { CampaignStatus } from './entities/ad-campaign.entity';

@Controller('ad/campaigns')
export class AdCampaignController {
  constructor(private readonly service: AdCampaignService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('active')
  async findActive() {
    return this.service.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAdCampaignDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdCampaignDto) {
    return this.service.update(id, dto);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: CampaignStatus) {
    return this.service.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Campaign deleted' };
  }
}
