import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Server health check endpoint' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('info')
  @ApiOperation({ summary: 'API info', description: 'Get HeartChain API information' })
  getInfo() {
    return this.appService.getInfo();
  }
}
