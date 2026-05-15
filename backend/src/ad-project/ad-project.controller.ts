import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { AdProjectService } from './ad-project.service';
import { GenerateProjectAdDto } from './dto/generate-project-ad.dto';

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

  // 初始化广告位（静态路由，放任何 :id 路由前面）
  @Post('init')
  async initAdSlots() {
    return this.service.initAdSlots();
  }

  // 填充公益广告
  @Post('seed')
  async seedVolunteerAds() {
    return this.service.seedVolunteerAds();
  }

  @Post('seed/quick')
  async quickSeedAds() {
    return this.service.quickSeedAds();
  }

  @Post('generate')
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
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Put('increment')
  async incrementQuota(@Param('id') id: string, @Body('count') count: number) {
    await this.service.incrementQuotaUsed(id, count);
    return { message: 'Quota updated' };
  }

  @Put('pause')
  async pause(@Param('id') id: string) {
    return this.service.pause(id);
  }

  @Put('resume')
  async resume(@Param('id') id: string) {
    return this.service.resume(id);
  }

  @Put('approve')
  async approve(@Param('id') id: string) {
    return this.service.updateStatus(id, 'active' as any);
  }

  @Put('reject')
  async reject(@Param('id') id: string) {
    return this.service.updateStatus(id, 'rejected' as any);
  }

  @Delete()
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'ProjectAd deleted' };
  }
}
