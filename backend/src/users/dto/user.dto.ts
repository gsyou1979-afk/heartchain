import { IsString, IsOptional, Length, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: '爱心志愿者' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  nickname?: string;

  @ApiPropertyOptional({ example: 'cn', description: 'Region: cn / kr / global' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'https://oss.example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: 'email@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '热爱公益，乐于助人' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'zh', description: 'Language preference' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: '["medical", "teaching"]', description: 'Skill tags' })
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ description: 'Education array' })
  @IsOptional()
  education?: { level: string; school: string; year: string }[];

  @ApiPropertyOptional({ example: true, description: 'Agree to receive promotional messages' })
  @IsOptional()
  agreePromotional?: boolean;

  @ApiPropertyOptional({ description: 'Location info' })
  @IsOptional()
  location?: {
    lat: number;
    lng: number;
    city: string;
    address: string;
  };
}

export class UpdateRegionDto {
  @ApiProperty({ example: 'kr', enum: ['cn', 'kr', 'global'] })
  @IsEnum(['cn', 'kr', 'global'])
  region: string;
}
