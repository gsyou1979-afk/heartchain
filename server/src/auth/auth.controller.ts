import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendSmsDto, SmsVerifyDto, PhoneLoginDto, RegisterDto, RefreshTokenDto, PasswordLoginDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sms/send')
  @HttpCode(200)
  async sendSms(@Body() dto: SendSmsDto) {
    return this.authService.sendSmsCode(dto);
  }

  @Public()
  @Post('sms/verify')
  @HttpCode(200)
  async verifySms(@Body() dto: SmsVerifyDto) {
    return this.authService.verifySmsCode(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: PhoneLoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithPhone(dto);
  }

  @Public()
  @Post('password-login')
  @HttpCode(200)
  async passwordLogin(@Body() dto: PasswordLoginDto): Promise<AuthResponseDto> {
    return this.authService.passwordLogin(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
