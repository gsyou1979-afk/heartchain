import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { AdProjectService } from './ad-project.service';
import { GenerateProjectAdDto, UpdateProjectAdDto } from './dto/generate-project-ad.dto';

@Controller('ad/project-ads')
export class AdProjectController {
  constructor(private readonly service: AdProjectService) {}

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('project/:projectId')
  async findByProjectId(@Param('projectId') projectId: string) {
    return this.service.findByProjectId(projectId);
  }

  @Post('generate')
  async generate(@Body() dto: GenerateProjectAdDto) {
    return this.service.generate(dto.projectId, dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectAdDto) {
    return this.service.update(id, dto);
  }

  @Put(':id/increment')
  async incrementQuota(@Param('id') id: string, @Body('count') count: number) {
    await this.service.incrementQuotaUsed(id, count);
    return { message: 'Quota updated' };
  }

  @Put(':id/pause')
  async pause(@Param('id') id: string) {
    return this.service.pause(id);
  }

  @Put(':id/resume')
  async resume(@Param('id') id: string) {
    return this.service.resume(id);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.service.updateStatus(id, 'active' as any);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string) {
    return this.service.updateStatus(id, 'rejected' as any);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'ProjectAd deleted' };
  }
}
