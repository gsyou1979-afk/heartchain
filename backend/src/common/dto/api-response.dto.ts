import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  code: number;

  @ApiProperty({ example: 'success', description: 'Response message' })
  message: string;

  @ApiPropertyOptional({ description: 'Response data' })
  data: T;

  @ApiPropertyOptional({ description: 'Timestamp' })
  timestamp: string;
}

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page', default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}

export class PaginatedResponseDto<T = any> {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  data: T[];

  @ApiProperty({ example: { total: 100, page: 1, limit: 20, totalPages: 5 } })
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty()
  timestamp: string;
}
