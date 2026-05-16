# 广告发布功能重新设计 - 实施计划

> **目标**：将当前分散的广告发布流程改为一站式发布页面，支持多种广告类型、实时预览、审核流程。

**架构**：前端单页表单 + 后端统一发布 API + 审核状态机

**Tech Stack**：Vue 3 + NestJS + PostgreSQL

---

## Phase 1: 后端 API 改造

### Task 1.1: 扩展广告类型枚举

**Files**:
- Modify: `backend/src/ad-campaign/entities/ad-campaign.entity.ts`

**Step 1: 修改 AdType 枚举**

```typescript
export enum AdType {
  COMMERCIAL = 'commercial',       // 商业广告
  PUBLIC_SERVICE = 'public_service', // 公益广告
  RECRUITMENT = 'recruitment',     // 招聘广告（新增）
  SCHOOL = 'school',               // 学校广告（新增）
  PROJECT = 'project',             // 项目求助
}
```

### Task 1.2: 创建统一发布 DTO

**Files**:
- Create: `backend/src/ad-campaign/dto/publish-ad.dto.ts`

```typescript
import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsBoolean, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AdType } from '../entities/ad-campaign.entity';

export class AdItemDto {
  @IsString()
  imageUrl: string;

  @IsString()
  @IsOptional()
  landingUrl?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsNumber()
  @IsOptional()
  rotationSeconds?: number = 5;
}

export class PublishAdDto {
  @IsString()
  name: string;

  @IsEnum(AdType)
  adType: AdType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  placementCodes: string[];

  @ValidateNested({ each: true })
  @Type(() => AdItemDto)
  items: AdItemDto[];

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  budgetTotal?: number;

  @IsOptional()
  targeting?: {
    geo?: { cities?: string[]; schools?: string[] };
    schedule?: { hours?: number[]; daysOfWeek?: number[] };
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
```

### Task 1.3: 创建统一发布接口

**Files**:
- Modify: `backend/src/ad-campaign/ad-campaign.service.ts`
- Modify: `backend/src/ad-campaign/ad-campaign.controller.ts`

**Step 1: 在 service 中添加 publish 方法**

```typescript
async publish(dto: PublishAdDto, advertiserId: string): Promise<AdCampaign> {
  // 1. 创建广告计划
  const campaign = this.campaignRepo.create({
    advertiserId,
    name: dto.name,
    adType: dto.adType,
    status: CampaignStatus.PENDING, // 默认待审核
    pricingModel: 'cpm',
    startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
    endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    budgetTotal: dto.budgetTotal,
    placements: dto.placementCodes,
    targeting: dto.targeting,
  });
  const saved = await this.campaignRepo.save(campaign);

  // 2. 批量创建轮播图片
  if (dto.items?.length > 0) {
    const itemRepo = this.campaignRepo.manager.getRepository(AdItem);
    const items = dto.items.map((item, idx) =>
      itemRepo.create({
        campaignId: saved.id,
        imageUrl: item.imageUrl,
        landingUrl: item.landingUrl || '',
        taskId: item.taskId || null,
        rotationSeconds: item.rotationSeconds || 5,
        sortOrder: idx,
      }),
    );
    await itemRepo.save(items);
  }

  return saved;
}
```

**Step 2: 在 controller 中添加接口**

```typescript
@Post('publish')
async publish(@Body() dto: PublishAdDto, @CurrentUser('id') userId: string) {
  return this.service.publish(dto, userId);
}
```

### Task 1.4: 添加审核接口

**Files**:
- Modify: `backend/src/ad-campaign/ad-campaign.controller.ts`

```typescript
@Put(':id/review')
@Roles('admin')
async review(@Param('id') id: string, @Body('action') action: 'approve' | 'reject') {
  const status = action === 'approve' ? CampaignStatus.ACTIVE : CampaignStatus.PAUSED;
  return this.service.updateStatus(id, status);
}
```

---

## Phase 2: 前端发布页面

### Task 2.1: 创建广告发布页面

**Files**:
- Create: `web/pages/admin/ads/publish.vue`

**页面结构**：
```
┌─────────────────────────────────────────────┐
│              发布广告                         │
├─────────────────────────────────────────────┤
│                                               │
│  步骤 1: 选择广告类型                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │商业  │ │公益  │ │招聘  │ │学校  │        │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
│                                               │
│  步骤 2: 基本信息                              │
│  广告名称 [________________]                   │
│  描述     [________________]                   │
│  投放时间 [开始] ~ [结束]                      │
│  预算     [____] 元                           │
│                                               │
│  步骤 3: 上传素材                              │
│  ┌─────────────────────────────┐              │
│  │  拖拽图片到此处或点击上传     │              │
│  └─────────────────────────────┘              │
│  [图1] [图2] [图3] [+]                        │
│                                               │
│  步骤 4: 选择投放位置                          │
│  ☑ A1 首页横幅 (1200×400)                     │
│  ☑ C1 信息流 (580×300)                        │
│  ☐ D1 底部通栏 (1200×150)                     │
│                                               │
│  步骤 5: 定向设置                              │
│  地区: [全部 ▼]  时间: [全天 ▼]               │
│                                               │
│  [预览] [保存草稿] [提交审核]                  │
└─────────────────────────────────────────────┘
```

### Task 2.2: 创建广告列表页面（带审核状态）

**Files**:
- Create: `web/pages/admin/ads/my-ads.vue

**功能**：
- 显示当前用户的所有广告
- 状态标签：草稿/待审核/已通过/已拒绝/投放中/已暂停
- 操作：编辑/暂停/删除/查看数据

### Task 2.3: 修改广告管理入口

**Files**:
- Modify: `web/pages/admin/ads/index.vue`

**改动**：
- 将"创建广告计划"按钮改为"发布广告"
- 添加"我的广告"tab
- 简化现有广告位管理

---

## Phase 3: 路由和导航

### Task 3.1: 添加路由

**Files**:
- Modify: `web/pages/admin/ads/index.vue`

```typescript
const tabs = [
  { key: 'my-ads', label: '我的广告' },
  { key: 'publish', label: '发布广告', isLink: true },
  { key: 'placements', label: '广告位管理' },
  { key: 'statistics', label: '数据统计' },
];
```

---

## 验证步骤

1. 后端编译：`cd backend && npm run build`
2. 前端编译：`cd web && npm run build`
3. 本地测试：`npm run start:dev`
4. 访问 `/admin/ads/publish` 测试发布流程
