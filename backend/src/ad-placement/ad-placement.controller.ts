import { Controller, Get, Post, Body, Param, Put, Delete, Inject } from '@nestjs/common';
import { AdPlacementService } from './ad-placement.service';
import { CreateAdPlacementDto } from './dto/create-placement.dto';
import { UpdateAdPlacementDto } from './dto/update-placement.dto';

@Controller('ad/placements')
export class AdPlacementController {
  @Inject(AdPlacementService)
  private readonly service: AdPlacementService;

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @Post()
  async create(@Body() dto: CreateAdPlacementDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdPlacementDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('init')
  async initDefaults() {
    await this.service.initDefaults();
    return { message: 'Default ad placements initialized' };
  }
}
