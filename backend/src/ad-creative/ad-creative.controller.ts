import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdCreativeService } from './ad-creative.service';
import { CreateAdCreativeDto, UpdateAdCreativeDto } from './dto/create-creative.dto';

@Controller('ad/creatives')
export class AdCreativeController {
  constructor(private readonly service: AdCreativeService) {}

  @Get()
  async findAll(@Param('campaignId') campaignId?: string) {
    return this.service.findAll(campaignId);
  }

  @Get('approved')
  async findApproved() {
    return this.service.findApproved();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAdCreativeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdCreativeDto) {
    return this.service.update(id, dto);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string) {
    return this.service.reject(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Creative deleted' };
  }
}
