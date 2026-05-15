import { Controller, Get, Post, Body, Delete, Param, Query } from '@nestjs/common';
import { AdTargetingService } from './ad-targeting.service';
import { CreateUserTagDto, BulkCreateUserTagDto } from './dto/user-tag.dto';

@Controller('ad/targeting')
export class AdTargetingController {
  constructor(private readonly service: AdTargetingService) {}

  @Get('user/:userId')
  async getUserTags(
    @Param('userId') userId: string,
    @Query('category') category?: string,
  ) {
    return this.service.findByUser(userId, category as any);
  }

  @Get('user/:userId/values')
  async getUserTagValues(@Param('userId') userId: string) {
    return this.service.getUserTagValues(userId);
  }

  @Post('tags')
  async createTag(@Body() dto: CreateUserTagDto) {
    return this.service.create(dto);
  }

  @Post('tags/bulk')
  async bulkCreateTags(@Body() dto: BulkCreateUserTagDto) {
    return this.service.bulkCreate(dto);
  }

  @Post('activity')
  async generateTagsFromActivity(
    @Body() dto: { userId: string; activity: { type: string; category?: string; city?: string; school?: string } },
  ) {
    await this.service.generateTagsFromActivity(dto.userId, dto.activity);
    return { message: 'Tags generated' };
  }

  @Get('users/by-tags')
  async findUsersByTags(@Query('criteria') criteria: string) {
    const parsed = JSON.parse(criteria);
    return this.service.findUsersByTags(parsed);
  }

  @Delete('user/:userId')
  async deleteUserTags(@Param('userId') userId: string) {
    await this.service.deleteByUser(userId);
    return { message: 'Tags deleted' };
  }
}
