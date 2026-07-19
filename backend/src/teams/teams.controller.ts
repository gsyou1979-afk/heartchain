import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/team.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all teams' })
  async findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team details' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.findById(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get team members' })
  async getMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.getMembers(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new team' })
  async createTeam(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTeamDto,
  ) {
    return this.teamsService.create(dto, userId);
  }

  @Post('join/:inviteCode')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Join team by invite code' })
  async joinTeam(
    @CurrentUser('id') userId: string,
    @Param('inviteCode') inviteCode: string,
  ) {
    return this.teamsService.joinByInviteCode(userId, inviteCode);
  }
}
