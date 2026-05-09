import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdCampaign } from './entities/ad-campaign.entity';
import { AdCampaignService } from './ad-campaign.service';
import { AdCampaignController } from './ad-campaign.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdCampaign])],
  controllers: [AdCampaignController],
  providers: [AdCampaignService],
  exports: [AdCampaignService],
})
export class AdCampaignModule {}
