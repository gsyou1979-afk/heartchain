import { IsString, IsOptional, IsEnum, Length, Matches } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format (E.164)' })
  phone: string;
}

export class SmsVerifyDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format (E.164)' })
  phone: string;

  @IsString()
  @Length(4, 6)
  code: string;
}

export class PhoneLoginDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone: string;

  @IsString()
  @Length(4, 6)
  code: string;
}

export class PasswordLoginDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: '手机号格式错误' })
  phone: string;

  @IsString()
  @Length(6, 50)
  password: string;
}

export class RegisterDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: '手机号格式错误，应为国际格式如 +821098765432' })
  phone: string;

  @IsString()
  @Length(4, 6)
  code: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  nickname?: string;

  @IsOptional()
  @IsEnum(['cn', 'kr', 'global'])
  region?: string;
}

export class RefreshTokenDto {
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
