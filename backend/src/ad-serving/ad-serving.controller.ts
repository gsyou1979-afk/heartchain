import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdServingService } from './ad-serving.service';
import { AdRequestDto, AdImpressionDto, AdClickDto, ConversionDto } from './dto/ad-request.dto';

@Controller('ad')
export class AdServingController {
  constructor(private readonly service: AdServingService) {}

  @Post('request')
  async requestAd(@Body() dto: AdRequestDto) {
    return this.service.requestAd(dto);
  }

  @Post('impression')
  async reportImpression(@Body() dto: AdImpressionDto) {
    return this.service.reportImpression(dto);
  }

  @Post('click')
  async reportClick(@Body() dto: AdClickDto) {
    await this.service.reportClick(dto);
    return { message: 'Click recorded' };
  }

  @Post('conversion')
  async reportConversion(@Body() dto: ConversionDto) {
    await this.service.reportConversion(dto);
    return { message: 'Conversion recorded' };
  }

  @Get('health')
  health() {
    return { status: 'ok', service: 'ad-serving' };
  }
}
