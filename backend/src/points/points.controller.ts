import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { TransferPointsDto, QueryTransactionDto } from './dto/point.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Points')
@ApiBearerAuth()
@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current HRT balance' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.pointsService.getBalance(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactions(
    @CurrentUser('id') userId: string,
    @Query() dto: QueryTransactionDto,
  ) {
    return this.pointsService.getTransactions(userId, dto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer HRT to another user' })
  async transfer(
    @CurrentUser('id') userId: string,
    @Body() dto: TransferPointsDto,
  ) {
    return this.pointsService.transfer(userId, dto);
  }
}
