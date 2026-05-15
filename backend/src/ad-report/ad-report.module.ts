import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdImpression } from '../ad-serving/entities/ad-impression.entity';
import { AdClick } from '../ad-serving/entities/ad-click.entity';
import { ProjectAdConversion } from '../ad-serving/entities/project-ad-conversion.entity';
import { ProjectAd } from '../ad-project/entities/ad-project.entity';
import { AdReportService } from './ad-report.service';
import { AdReportController } from './ad-report.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdImpression, AdClick, ProjectAdConversion, ProjectAd]),
  ],
  controllers: [AdReportController],
  providers: [AdReportService],
  exports: [AdReportService],
})
export class AdReportModule {}
