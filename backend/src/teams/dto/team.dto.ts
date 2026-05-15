import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/api-response.dto';

export class CreateTeamDto {
  @ApiProperty({ example: '爱心志愿队' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({ example: '社区志愿服务团队' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'community', description: 'Organization type' })
  @IsOptional()
  @IsString()
  orgType?: string;

  @ApiPropertyOptional({ example: 'cn' })
  @IsOptional()
  region?: string;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'user-uuid', description: 'User ID to invite' })
  @IsString()
  userId: string;
}
