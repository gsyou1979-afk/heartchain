/**
 * 角色权限装饰器
 * 用于在 Controller 或路由上标记需要的角色
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * 设置路由需要的角色
 * @example
 * @Roles(UserRole.ADMIN)
 * @Get('admin/users')
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 角色常量
 */
export const RolePermissions = {
  // 管理员权限
  ADMIN: [UserRole.ADMIN],
  // 组织权限
  ORGANIZATION: [UserRole.ORGANIZATION, UserRole.ADMIN],
  // 队长权限（包含团队管理员）
  TEAM_LEADER: [UserRole.ORGANIZATION, UserRole.VOLUNTEER, UserRole.ADMIN],
  // 登录用户权限
  AUTHENTICATED: [
    UserRole.VOLUNTEER,
    UserRole.ORGANIZATION,
    UserRole.SKILL_PROVIDER,
    UserRole.DONOR,
    UserRole.ADMIN,
  ],
} as const;
