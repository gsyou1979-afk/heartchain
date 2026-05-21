import { Controller, Get, Post, Body, Param, Put, Delete, Inject, Query, UseGuards } from '@nestjs/common';
import { AdPlacementService } from './ad-placement.service';
import { CreateAdPlacementDto } from './dto/create-placement.dto';
import { UpdateAdPlacementDto } from './dto/update-placement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('ad/placements')
export class AdPlacementController {
  @Inject(AdPlacementService)
  private readonly service: AdPlacementService;

  @Get()
  async findAll(@Query('activeOnly') activeOnly?: string) {
    return this.service.findAll(activeOnly !== 'false');
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllAdmin() {
    return this.service.findAllAdmin();
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateAdPlacementDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateAdPlacementDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('init')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async initDefaults() {
    await this.service.initDefaults();
    return { message: 'Default ad placements initialized' };
  }
}
