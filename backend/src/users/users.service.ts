import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto, UpdateRegionDto } from './dto/user.dto';

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

    // Get user's team memberships
    // Get user's task statistics
    // TODO: Add these when Teams and Tasks modules are fully implemented

    return {
      ...user,
      stats: {
        totalPoints: user.pointBalance,
        creditScore: user.creditScore,
        completedTasks: 0, // TODO: count from tasks table
        teamCount: 0, // TODO: count from team_members table
      },
    };
  }
}
