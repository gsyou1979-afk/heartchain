import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdCreative } from './entities/ad-creative.entity';
import { AdCreativeService } from './ad-creative.service';
import { AdCreativeController } from './ad-creative.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdCreative])],
  controllers: [AdCreativeController],
  providers: [AdCreativeService],
  exports: [AdCreativeService],
})
export class AdCreativeModule {}
