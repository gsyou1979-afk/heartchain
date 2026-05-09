import { IsString, IsNumber, IsOptional, Min, Length, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/api-response.dto';

export class TransferPointsDto {
  @ApiProperty({ example: 'user-uuid-here', description: 'Recipient user ID' })
  @IsString()
  @IsUUID()
  toUserId: string;

  @ApiProperty({ example: 10, description: 'Amount of HRT to transfer' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 'Thanks for the help!' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  description?: string;
}

export class QueryTransactionDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['task_reward', 'transfer', 'donation', 'refund', 'admin_adjust'] })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO string)' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO string)' })
  @IsOptional()
  endDate?: string;
}
