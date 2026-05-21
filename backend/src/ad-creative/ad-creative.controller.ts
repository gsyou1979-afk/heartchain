import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AdCreativeService } from './ad-creative.service';
import { CreateAdCreativeDto, UpdateAdCreativeDto } from './dto/create-creative.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

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
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateAdCreativeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateAdCreativeDto) {
    return this.service.update(id, dto);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reject(@Param('id') id: string) {
    return this.service.reject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Creative deleted' };
  }
}
