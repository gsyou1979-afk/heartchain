import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'heartchain_jwt_secret'),
    });
  }

  async validate(payload: { sub: string; phone: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'phone', 'nickname', 'role', 'status', 'creditScore', 'region'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === 'banned') {
      throw new UnauthorizedException('Account has been banned');
    }

    return user;
  }
}
