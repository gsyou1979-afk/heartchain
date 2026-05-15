import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTag } from './entities/user-tag.entity';
import { AdTargetingService } from './ad-targeting.service';
import { AdTargetingController } from './ad-targeting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserTag])],
  controllers: [AdTargetingController],
  providers: [AdTargetingService],
  exports: [AdTargetingService],
})
export class AdTargetingModule {}
