import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { AdProjectService } from './ad-project.service';
import { GenerateProjectAdDto } from './dto/generate-project-ad.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('ad/project-ads')
export class AdProjectController {
  constructor(private readonly service: AdProjectService) {}

  // 列表 & 统计类路由（静态路径，不含 :id）
  @Get()
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status as any);
  }

  @Get('active')
  async findActive(@Query('limit') limit?: number) {
    return this.service.findActive(limit || 10);
  }

  @Get('targeting')
  async findForTargeting(
    @Query('city') city?: string,
    @Query('interests') interests?: string,
  ) {
    const interestList = interests ? interests.split(',') : [];
    return this.service.findForTargeting(city, interestList);
  }

  @Get('project/:projectId')
  async findByProjectId(@Param('projectId') projectId: string) {
    return this.service.findByProjectId(projectId);
  }

  // 初始化广告位（需要管理员权限）
  @Post('init')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async initAdSlots() {
    return this.service.initAdSlots();
  }

  // 填充公益广告（需要管理员权限）
  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async seedVolunteerAds() {
    return this.service.seedVolunteerAds();
  }

  @Post('seed/quick')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async quickSeedAds() {
    return this.service.quickSeedAds();
  }

  // 生成项目广告（需要登录）
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Body() dto: GenerateProjectAdDto) {
    return this.service.generate(dto.projectId, dto);
  }
}

// 所有含 :id 的操作路由拆分到独立控制器，避免路由匹配冲突
@Controller('ad/project-ads/:id')
export class AdProjectItemController {
  constructor(private readonly service: AdProjectService) {}

  @Get()
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Put('increment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async incrementQuota(@Param('id') id: string, @Body('count') count: number) {
    await this.service.incrementQuotaUsed(id, count);
    return { message: 'Quota updated' };
  }

  @Put('pause')
  @UseGuards(JwtAuthGuard)
  async pause(@Param('id') id: string) {
    return this.service.pause(id);
  }

  @Put('resume')
  @UseGuards(JwtAuthGuard)
  async resume(@Param('id') id: string) {
    return this.service.resume(id);
  }

  @Put('approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approve(@Param('id') id: string) {
    return this.service.updateStatus(id, 'active' as any);
  }

  @Put('reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reject(@Param('id') id: string) {
    return this.service.updateStatus(id, 'rejected' as any);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'ProjectAd deleted' };
  }
}
