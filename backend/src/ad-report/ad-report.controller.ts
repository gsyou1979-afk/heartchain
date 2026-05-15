import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdReportService } from './ad-report.service';

@Controller('ad/reports')
export class AdReportController {
  constructor(private readonly service: AdReportService) {}

  @Get('overall')
  async getOverallStats(@Query('adType') adType?: string) {
    return this.service.getOverallStats(adType);
  }

  @Get('by-type')
  async getStatsByType() {
    return this.service.getStatsByType();
  }

  @Get('by-placement')
  async getStatsByPlacement() {
    return this.service.getStatsByPlacement();
  }

  @Get('daily')
  async getDailyStats(@Query('days') days?: number, @Query('adType') adType?: string) {
    return this.service.getDailyStats(days || 7, adType);
  }

  @Get('project-ad/:projectAdId')
  async getProjectAdStats(@Param('projectAdId') projectAdId: string) {
    return this.service.getProjectAdStats(projectAdId);
  }

  @Get('campaign/:campaignId')
  async getCampaignStats(@Param('campaignId') campaignId: string) {
    return this.service.getCampaignStats(campaignId);
  }

  @Get('top-project-ads')
  async getTopProjectAds(@Query('limit') limit?: number) {
    return this.service.getTopProjectAds(limit || 10);
  }

  /** 简化统计（给前端广告管理页面用） */
  @Get('summary')
  async getSummary() {
    return this.service.getSummary();
  }
}
