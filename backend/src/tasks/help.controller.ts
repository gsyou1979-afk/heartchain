import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HelpService } from './help.service';
import { CreateHelpDto, QueryNearbyDto } from './dto/help.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Help Requests')
@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Public()
  @Get('nearby')
  @ApiOperation({ summary: '获取附近求助' })
  async nearby(@Query() dto: QueryNearbyDto) {
    return this.helpService.findNearby(dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '求助详情' })
  async detail(@Param('id') id: string) {
    return this.helpService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '发布求助' })
  async create(@Body() dto: CreateHelpDto, @CurrentUser('id') userId: string) {
    return this.helpService.create(dto, userId);
  }

  @Post(':id/accept')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '接受求助' })
  async accept(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.helpService.accept(id, userId);
  }
}
