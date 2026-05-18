import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { SendSmsDto, PhoneLoginDto, RegisterDto, AuthResponseDto, PasswordLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly isDev: boolean;
  private readonly fixedCode: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.isDev = this.configService.get<string>('NODE_ENV') === 'development';
    this.fixedCode = this.configService.get<string>('DEV_SMS_CODE', '123456');
  }

  // 存储验证码（生产环境应使用Redis）
  private readonly smsCodeStore = new Map<string, { code: string; expiresAt: number }>();

  async sendSmsCode(dto: SendSmsDto): Promise<{ message: string; expiresIn: number }> {
    const expiresIn = 300;
    const code = this.isDev ? this.fixedCode : Math.floor(100000 + Math.random() * 900000).toString();
    
    // 存储验证码
    this.smsCodeStore.set(dto.phone, { code, expiresAt: Date.now() + expiresIn * 1000 });
    
    if (this.isDev) {
      console.log(`[DEV SMS] Phone: ${dto.phone}, Code: ${code}, Expires: ${expiresIn}s`);
      return { message: `验证码已发送（开发模式：${code}）`, expiresIn };
    }
    // TODO: 生产环境接入真实短信服务（如 Twilio / 阿里云短信）
    return { message: '验证码已发送', expiresIn };
  }

  // 验证短信验证码
  verifySmsCode(phone: string, code: string): boolean {
    const stored = this.smsCodeStore.get(phone);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
      this.smsCodeStore.delete(phone);
      return false;
    }
    return stored.code === code;
  }

  // 忘记密码：通过手机验证码重置
  async resetPassword(phone: string, code: string, newPassword: string): Promise<void> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('该手机号未注册');
    }

    // 验证短信验证码
    if (!this.verifySmsCode(phone, code)) {
      throw new UnauthorizedException('验证码错误或已过期');
    }

    // 使用 bcrypt 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // 清除已使用的验证码
    this.smsCodeStore.delete(phone);
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // 验证码校验：开发模式用固定码，生产模式也支持固定码（TODO: 接入真实短信后移除）
    if (dto.code !== this.fixedCode) {
      throw new UnauthorizedException(`验证码错误（开发模式请输入：${this.fixedCode}）`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new ConflictException('该手机号已注册');
    }

    // 使用 bcrypt 加密密码（替代不安全的 MD5）
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = new User();
    user.phone = dto.phone;
    user.password = hashedPassword;
    user.nickname = dto.nickname || `user${Date.now().toString(36)}`;
    user.region = dto.region || 'cn';
    user.phoneVerified = true;
    user.language = dto.region === 'kr' ? 'ko' : 'zh';
    user.role = UserRole.VOLUNTEER;
    user.status = UserStatus.ACTIVE;
    user.creditScore = 0;
    user.pointBalance = 0;

    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async loginWithPhone(dto: PhoneLoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    if (user.status === 'banned') {
      throw new UnauthorizedException('Account has been banned');
    }

    user.phoneVerified = true;
    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async passwordLogin(dto: PasswordLoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在，请先注册');
    }

    // 使用 bcrypt 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    if (user.status === 'banned') {
      throw new UnauthorizedException('账号已被封禁');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // DEV ONLY: quick login as first admin user
  async devLogin(): Promise<AuthResponseDto> {
    const admin = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN },
      order: { createdAt: 'ASC' },
    });
    if (!admin) {
      throw new UnauthorizedException('No admin user found');
    }
    return this.generateTokens(admin);
  }

  private async generateTokens(user: User): Promise<AuthResponseDto> {
    const payload = { sub: user.id, phone: user.phone };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 7 * 24 * 3600,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
        region: user.region,
        skills: user.skills || [],
        education: user.education || [],
        avatar: user.avatar,
        bio: user.bio,
      },
    };
  }
}
