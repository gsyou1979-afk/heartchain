import { Controller, Post, Body, HttpCode, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendSmsDto, PhoneLoginDto, RegisterDto, RefreshTokenDto, PasswordLoginDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sms/send')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send SMS verification code' })
  async sendSms(@Body() dto: SendSmsDto) {
    return this.authService.sendSmsCode(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with phone + SMS code' })
  async login(@Body() dto: PhoneLoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithPhone(dto);
  }

  @Public()
  @Post('password-login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with phone + password' })
  async passwordLogin(@Body() dto: PasswordLoginDto): Promise<AuthResponseDto> {
    return this.authService.passwordLogin(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
