import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AdCampaignService } from './ad-campaign.service';
import { CreateAdCampaignDto, UpdateAdCampaignDto } from './dto/create-campaign.dto';
import { PublishAdDto } from './dto/publish-ad.dto';
import { CampaignStatus } from './entities/ad-campaign.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

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

  @Post('publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Body() dto: PublishAdDto, @CurrentUser('id') userId: string) {
    return this.service.publish(dto, userId);
  }

  @Put(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async review(@Param('id') id: string, @Body('action') action: 'approve' | 'reject') {
    const status = action === 'approve' ? CampaignStatus.ACTIVE : CampaignStatus.PAUSED;
    return this.service.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Campaign deleted' };
  }
}
