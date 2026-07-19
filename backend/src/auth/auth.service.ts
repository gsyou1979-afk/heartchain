import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

// Simple password hash/verify for development (replace with bcrypt in production)
function hashPassword(password: string): string {
  return md5(password + 'heartchain_salt');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { SendSmsDto, PhoneLoginDto, RegisterDto, AuthResponseDto, PasswordLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendSmsCode(dto: SendSmsDto): Promise<{ message: string; expiresIn: number }> {
    // 开发模式：固定验证码 123456
    const expiresIn = 300;
    console.log(`[DEV SMS] Phone: ${dto.phone}, Code: 123456 (固定验证码), Expires: ${expiresIn}s`);
    return { message: '验证码已发送（开发模式：123456）', expiresIn };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // 开发模式：验证固定验证码 123456
    if (dto.code !== '123456') {
      throw new UnauthorizedException('验证码错误（开发模式请输入：123456）');
    }

    const existingUser = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new ConflictException('该手机号已注册');
    }

    // 加密密码
    const hashedPassword = hashPassword(dto.password);

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

    const isPasswordValid = verifyPassword(dto.password, user.password);
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
