import { Module, Global } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { PointsService } from './points.service';

@Global()
@Module({
  providers: [Web3Service, PointsService],
  exports: [Web3Service, PointsService],
})
export class Web3Module {}