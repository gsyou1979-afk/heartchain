import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdItem } from './entities/ad-item.entity';
import { AdItemService } from './ad-item.service';
import { AdItemController } from './ad-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdItem])],
  controllers: [AdItemController],
  providers: [AdItemService],
  exports: [AdItemService],
})
export class AdItemModule {}
