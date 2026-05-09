import { IsString, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty({ example: '13800138000', description: 'Phone number with country code' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format (E.164)' })
  phone: string;
}

export class PhoneLoginDto {
  @ApiProperty({ example: '+8613800138000', description: 'Phone number (E.164)' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone: string;

  @ApiProperty({ example: '123456', description: 'SMS verification code' })
  @IsString()
  @Length(4, 6)
  code: string;
}

export class PasswordLoginDto {
  @ApiProperty({ example: '+8613800138000', description: 'Phone number (E.164)' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: '手机号格式错误' })
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @Length(6, 50)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: '+8613800138000', description: 'Phone number (E.164)' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: '手机号格式错误，应为国际格式如 +821098765432' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'SMS verification code' })
  @IsString()
  @Length(4, 6)
  code: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 6 characters)' })
  @IsString()
  @Length(6, 50)
  password: string;

  @ApiPropertyOptional({ example: '爱心志愿者', description: 'Nickname' })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  nickname?: string;

  @ApiPropertyOptional({ example: 'cn', description: 'User region', enum: ['cn', 'kr', 'global'] })
  @IsOptional()
  @IsEnum(['cn', 'kr', 'global'])
  region?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    phone: string;
    nickname: string;
    role: string;
    region: string;
    skills?: string[];
    education?: { level: string; school: string; year: string }[];
    avatar?: string;
    bio?: string;
  };
}
