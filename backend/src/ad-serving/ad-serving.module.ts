import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdImpression } from './entities/ad-impression.entity';
import { AdClick } from './entities/ad-click.entity';
import { AdFrequency } from './entities/ad-frequency.entity';
import { ProjectAdConversion } from './entities/project-ad-conversion.entity';
import { AdServingService } from './ad-serving.service';
import { AdServingController } from './ad-serving.controller';
import { AdProjectModule } from '../ad-project/ad-project.module';
import { AdCreativeModule } from '../ad-creative/ad-creative.module';
import { AdCampaignModule } from '../ad-campaign/ad-campaign.module';
import { AdPlacementModule } from '../ad-placement/ad-placement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdImpression, AdClick, AdFrequency, ProjectAdConversion, AdItem]),
    AdProjectModule,
    AdCreativeModule,
    AdCampaignModule,
    AdPlacementModule,
    AdItemModule,
  ],
  controllers: [AdServingController],
  providers: [AdServingService],
  exports: [AdServingService],
})
export class AdServingModule {}
