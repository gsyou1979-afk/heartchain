import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdCampaign } from './entities/ad-campaign.entity';
import { AdCampaignService } from './ad-campaign.service';
import { AdCampaignController } from './ad-campaign.controller';
import { AdItem } from '../ad-item/entities/ad-item.entity';
import { AdCreative } from '../ad-creative/entities/ad-creative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdCampaign, AdItem, AdCreative])],
  controllers: [AdCampaignController],
  providers: [AdCampaignService],
  exports: [AdCampaignService],
})
export class AdCampaignModule {}
