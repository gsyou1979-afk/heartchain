import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectAd } from './entities/ad-project.entity';
import { AdProjectService } from './ad-project.service';
import { AdProjectController, AdProjectItemController } from './ad-project.controller';
import { AdAutoGeneratorService } from './ad-auto-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectAd])],
  controllers: [AdProjectController, AdProjectItemController],
  providers: [AdProjectService, AdAutoGeneratorService],
  exports: [AdProjectService, AdAutoGeneratorService],
})
export class AdProjectModule {}
