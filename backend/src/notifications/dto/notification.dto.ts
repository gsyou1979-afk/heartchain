import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/api-response.dto';

export class QueryNotificationDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['unread', 'read'] })
  @IsOptional()
  @IsEnum(['unread', 'read'])
  status?: string;
}
