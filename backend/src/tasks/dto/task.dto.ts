import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray, ValidateNested, Min, Max, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/api-response.dto';

export class LocationDto {
  @ApiPropertyOptional({ example: 37.5665 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 126.978 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 'Seoul' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Gangnam District' })
  @IsOptional()
  @IsString()
  address?: string;
}

// 任务类型 - 使用字符串而非枚举
export const TASK_TYPES = {
  SINGLE_ONCE: 'single_once',
  SINGLE_MULTI: 'single_multi',
  TEAM_ONCE: 'team_once',
  TEAM_MULTI: 'team_multi',
} as const;

// 技能积分映射
export const SKILL_POINTS_MAP: Record<string, number> = {
  medical: 50,
  legal: 40,
  teaching: 30,
  tech: 35,
  design: 25,
  translation: 20,
  driving: 25,
  cooking: 20,
  cleaning: 15,
  repair: 30,
  security: 20,
  elderly_care: 30,
  childcare: 25,
  event: 25,
  media: 20,
};

// TaskScheduleDto 必须放在 CreateTaskDto 之前
export class TaskScheduleDto {
  @ApiPropertyOptional({ enum: ['once', 'range'] })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: '2026-04-28' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: '09:00-12:00' })
  @IsOptional()
  @IsString()
  timeSlot?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: '12:00' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ example: '2026-04-28' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-05' })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class CreateTaskDto {
  @ApiProperty({ example: '社区老人陪诊' })
  @IsString()
  @Length(2, 100)
  title: string;

  @ApiPropertyOptional({ example: '帮助社区独居老人前往医院就诊' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['single_once', 'single_multi', 'team_once', 'team_multi'], example: 'single_once' })
  @IsString()
  taskType: string;

  @ApiProperty({ example: ['medical', 'driving'], description: '所需技能' })
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @ApiPropertyOptional({ example: 'Seoul', description: '任务地点' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: '任务日期时间设置' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskScheduleDto)
  schedule?: TaskScheduleDto;

  @ApiPropertyOptional({ example: 50, description: '自动计算的积分奖励' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsReward?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  volunteerCount?: number;

  @ApiPropertyOptional({ example: 5, description: '团队任务需要的人数' })
  @IsOptional()
  @IsNumber()
  @Min(2)
  teamSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  // 兼容前端 reward 字段
  @ApiPropertyOptional({ description: '兼容前端字段' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reward?: number;

  // 兼容前端 rewardType 字段
  @ApiPropertyOptional({ description: '兼容前端字段' })
  @IsOptional()
  @IsString()
  rewardType?: string;

  // 劳动类型 - 用于自动计算积分
  @ApiPropertyOptional({ example: 'normal', description: '劳动类型: simple, normal, skilled, heavy' })
  @IsOptional()
  @IsString()
  laborType?: string;

  // 工时（小时）- 用于自动计算积分
  @ApiPropertyOptional({ example: 2, description: '预计工时（小时）' })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  estimatedHours?: number;
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'single_once' })
  @IsOptional()
  @IsString()
  taskType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskScheduleDto)
  schedule?: TaskScheduleDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsReward?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  volunteerCount?: number;

  @ApiPropertyOptional({ example: 5, description: '团队任务需要的人数' })
  @IsOptional()
  @IsNumber()
  @Min(2)
  teamSize?: number;
}

export class QueryTaskDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'single_once' })
  @IsOptional()
  @IsString()
  taskType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publisherId?: string;
}

export class SubmitProofDto {
  @ApiProperty({ description: 'Proof evidence items' })
  @IsArray()
  evidence: {
    type: 'image' | 'location' | 'description';
    url?: string;
    text?: string;
    timestamp?: string;
  }[];
}

export class EndorseTaskDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  confirmed: boolean;

  @ApiPropertyOptional({ example: 'Great work!' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}
