import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto, UpdateRegionDto } from './dto/user.dto';
import { AdPreferenceDto } from '../common/dto/ad-preference.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsersCount() {
    const count = await this.userRepository.count();
    return { total: count };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id', 'phone', 'nickname', 'avatar', 'email', 'role',
        'status', 'creditScore', 'pointBalance', 'walletAddress',
        'realNameVerified', 'region', 'bio', 'skills', 'education',
        'agreePromotional', 'location', 'language', 'createdAt',
        'adEnabled', 'adPreferences',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);

    return this.findById(id);
  }

  async updateRegion(id: string, dto: UpdateRegionDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.region = dto.region;
    user.language = dto.region === 'kr' ? 'ko' : 'zh';
    await this.userRepository.save(user);

    return this.findById(id);
  }

  async getProfile(id: string) {
    const user = await this.findById(id);

    return {
      ...user,
      stats: {
        totalPoints: user.pointBalance,
        creditScore: user.creditScore,
        completedTasks: 0,
        teamCount: 0,
      },
    };
  }

  // Ad Preference Methods
  async getAdPreferences(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      adEnabled: user.adEnabled ?? true,
      preferences: user.adPreferences ?? {
        projectAds: true,
        charityAds: true,
        commercialAds: false,
      },
      maxDailyAds: 20,
      adInterval: 5,
      personalizedAds: true,
    };
  }

  async updateAdPreferences(id: string, dto: AdPreferenceDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.adEnabled !== undefined) {
      user.adEnabled = dto.adEnabled;
    }
    if (dto.preferences !== undefined && dto.preferences) {
      user.adPreferences = {
        projectAds: dto.preferences.projectAds ?? user.adPreferences?.projectAds ?? true,
        charityAds: dto.preferences.charityAds ?? user.adPreferences?.charityAds ?? true,
        commercialAds: dto.preferences.commercialAds ?? user.adPreferences?.commercialAds ?? false,
      };
    }

    await this.userRepository.save(user);

    return this.getAdPreferences(id);
  }
}
