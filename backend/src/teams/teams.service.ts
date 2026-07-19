import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamMember, TeamRole, TeamStatus } from './entities/team.entity';
import { CreateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private memberRepository: Repository<TeamMember>,
  ) {}

  async create(dto: CreateTeamDto, leaderId: string): Promise<Team> {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const team = new Team();
    team.name = dto.name;
    team.description = dto.description;
    team.orgType = dto.orgType;
    team.region = dto.region;
    team.leaderId = leaderId;
    team.inviteCode = inviteCode;
    team.memberCount = 1;
    team.totalPoints = 0;
    team.taskCount = 0;
    team.status = TeamStatus.ACTIVE;
    team.isVerified = false;

    const savedTeam = await this.teamRepository.save(team);

    const member = new TeamMember();
    member.teamId = savedTeam.id;
    member.userId = leaderId;
    member.role = TeamRole.LEADER;
    member.contributedPoints = 0;
    member.completedTasks = 0;

    await this.memberRepository.save(member);

    return savedTeam;
  }

  async findAll() {
    return this.teamRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
    });

    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async getMembers(teamId: string) {
    return this.memberRepository.find({
      where: { teamId },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async joinByInviteCode(userId: string, inviteCode: string): Promise<TeamMember> {
    const team = await this.teamRepository.findOne({ where: { inviteCode } });
    if (!team) throw new NotFoundException('Invalid invite code');

    const existing = await this.memberRepository.findOne({
      where: { teamId: team.id, userId },
    });

    if (existing) throw new NotFoundException('Already a member');

    const member = new TeamMember();
    member.teamId = team.id;
    member.userId = userId;
    member.role = TeamRole.MEMBER;
    member.contributedPoints = 0;
    member.completedTasks = 0;

    team.memberCount += 1;
    await this.teamRepository.save(team);

    return this.memberRepository.save(member);
  }
}
