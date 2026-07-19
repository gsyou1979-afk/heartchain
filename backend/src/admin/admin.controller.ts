/**
 * 管理员后台控制器 - 增强版
 * 新增：批量添加用户、积分规则配置
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService, PointRules } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, RolePermissions } from '../common/decorators/roles.decorator';
import { UserRole, UserStatus } from '../users/entities/user.entity';

// ============ DTO 定义 ============

class BatchCreateUserDto {
  users: {
    phone: string;
    nickname?: string;
    password?: string;
    role?: UserRole;
  }[];
}

class UpdateUserRoleDto {
  role: UserRole;
}

class SetAdminDto {
  userId: string;
  action: 'promote' | 'demote'; // 升为管理员 or 取消管理员
}

class PointRuleDto {
  // 标准工时积分（每小时基础积分）
  hourlyRate?: number;
  // 劳动类型系数（百分比）
  laborTypes?: {
    type: string;       // 劳动类型名称
    multiplier: number; // 系数（1.0 = 100%）
  }[];
}

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ============ 仪表盘 ============

  @Get('dashboard')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取管理后台统计数据（含积分统计）' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // ============ 用户管理 ============

  @Get('users')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取用户列表（分页）' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async getUsers(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
    @Query('keyword') keyword?: string,
  ) {
    return this.adminService.getUsers({ page, pageSize, role, status, keyword });
  }

  @Get('users/:id')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取用户详情' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users/batch')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '批量创建用户' })
  async batchCreateUsers(@Body() dto: BatchCreateUserDto) {
    return this.adminService.batchCreateUsers(dto.users);
  }

  @Put('users/:id/role')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '更新用户角色' })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Put('users/:id/set-admin')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '设置/取消管理员权限' })
  async setAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('action') action: 'promote' | 'demote',
  ) {
    const role = action === 'promote' ? UserRole.ADMIN : UserRole.VOLUNTEER;
    return this.adminService.updateUserRole(id, role);
  }

  @Put('users/:id/status')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '更新用户状态' })
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: UserStatus,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Delete('users/:id')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '删除/禁用用户' })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  // ============ 任务管理 ============

  @Get('tasks')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取任务列表（分页）' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async getTasks(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.adminService.getTasks({ page, pageSize, status, keyword });
  }

  @Get('tasks/:id')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取任务详情' })
  async getTaskById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getTaskById(id);
  }

  @Delete('tasks/:id')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '删除任务' })
  async deleteTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteTask(id);
  }

  @Put('tasks/:id/force-complete')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '强制完成任务' })
  async forceCompleteTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.forceCompleteTask(id);
  }

  // ============ 团队管理 ============

  @Get('teams')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取团队列表（分页）' })
  async getTeams(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.adminService.getTeams({ page, pageSize, keyword });
  }

  @Get('teams/:id')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取团队详情' })
  async getTeamById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getTeamById(id);
  }

  @Delete('teams/:id')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '解散团队' })
  async dissolveTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.dissolveTeam(id);
  }

  // ============ 积分规则配置 ============

  @Get('points/rules')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取积分规则配置' })
  async getPointRules(): Promise<PointRules> {
    return this.adminService.getPointRules();
  }

  @Put('points/rules')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '更新积分规则配置' })
  async updatePointRules(@Body() body: any): Promise<PointRules> {
    return this.adminService.updatePointRules(body);
  }

  // ============ 积分管理 ============

  @Get('transactions')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取积分交易记录（分页）' })
  async getTransactions(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('type') type?: string,
  ) {
    return this.adminService.getTransactions({ page, pageSize, type });
  }

  @Get('points/stats')
  @Roles(...RolePermissions.ADMIN)
  @ApiOperation({ summary: '获取积分统计' })
  async getPointsStats() {
    return this.adminService.getPointsStats();
  }
}
