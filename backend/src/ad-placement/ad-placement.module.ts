import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdPlacement } from './entities/ad-placement.entity';
import { AdPlacementService } from './ad-placement.service';
import { AdPlacementController } from './ad-placement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdPlacement])],
  controllers: [AdPlacementController],
  providers: [AdPlacementService],
  exports: [AdPlacementService],
})
export class AdPlacementModule {}
