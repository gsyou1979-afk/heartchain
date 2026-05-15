# HeartChain 项目配置与关键决策

---

## 项目位置
- **后端**: `E:\WorkBuddy\heartchain\backend`
- **前端**: `E:\WorkBuddy\heartchain\web`
- **数据库**: PostgreSQL, `heartchain` 数据库

## 服务端口
- **后端 API**: http://localhost:3000
- **前端 (Nuxt)**: http://localhost:3001

## 技术栈
- **后端**: NestJS + TypeORM + PostgreSQL
- **前端**: Nuxt.js 3 + Vue 3 + Tailwind CSS + Pinia
- **API 前缀**: `/api/v1`

---

## 🔑 关键修复记录

### 1. 数据库列名与 Entity 定义匹配 ⚠️重要
**问题**: TypeORM 在 PostgreSQL 中将驼峰转小写，导致 `teamSize` → `teamsize`
**解决**: Entity 中使用 `name: 'teamsize'` 显式指定列名

```typescript
@Column({ type: 'int', default: 1, name: 'teamsize' })
teamSize: number;

@Column({ type: 'int', default: 0, name: 'currentparticipants' })
currentParticipants: number;
```

### 2. 数据库缺失列
```sql
ALTER TABLE tasks ADD COLUMN teamsize INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN currentparticipants INTEGER DEFAULT 0;
```

### 3. JSON 字段存储问题
**问题**: `location` 和 `schedule` 字段存储纯文本而非 JSON
**解决**: Entity 改为 `text` 类型，service 手动序列化/反序列化

```typescript
// Entity
@Column({ type: 'text', nullable: true })
schedule: string;

// Service
task.schedule = typeof dto.schedule === 'object' ? JSON.stringify(dto.schedule) : dto.schedule;
```

### 4. 多人任务逻辑
**规则**:
- 单人任务：参加后直接 `in_progress`，从大厅消失
- 团队任务：参加后 `currentParticipants++`，达到 `teamSize` 才 `in_progress`

### 5. 导航栏设计
| 状态 | 导航项 |
|-----|-------|
| 未登录 | 首页 + 任务大厅 + 爱心榜 |
| 登录后 | 首页 + 任务大厅 + 我的任务 + 成就 |

### 6. 爱心榜页面 (/pages/heart-board.vue)
- 未登录也可访问
- 显示爱心积分总额、已完成积分、会员人数、完成任务数
- 烫手爱心栏、最感人事迹发表框

### 7. 成就页面 (/pages/wallet.vue)
- 仅登录后可访问
- 显示积分、完成任务、服务时长、信誉评分
- **志愿证明下载功能**：A4 PDF格式，含感谢话语、哈特链公章、会长签字

---

## 📝 用户账号

### 测试账号 (KP的账号)
- 手机号: `+821022098999`
- 密码: `asdf123`
- 昵称: `TestUser` (KP注册时设置)
- 技能: repair, driving, cleaning, translation, event, 투자유치

### 默认验证码
- 后端固定验证码: `123456`

---

## ⚠️ 开发注意事项

1. **修改 Entity 后必须重新编译**: `npm run build` 然后重启后端
2. **数据库迁移**: 修改数据库后确保列名匹配 Entity 定义
3. **JSON 字段**: location/schedule/requiredSkills 存为 text，需手动序列化
4. **schedule 格式**: 前端发送 schedule 对象而非顶级字段

---

## 项目结构

```
heartchain/
├── backend/
│   ├── src/
│   │   ├── tasks/          # 任务模块
│   │   ├── users/          # 用户模块
│   │   ├── auth/           # 认证模块
│   │   └── database/       # 数据库配置
│   └── dist/               # 编译输出
├── web/
│   ├── components/         # Vue 组件
│   ├── pages/             # 页面
│   │   ├── tasks/index.vue # 任务大厅+发布
│   │   ├── mytasks.vue     # 我的任务
│   │   ├── wallet.vue      # 成就页面+证明下载
│   │   └── heart-board.vue # 爱心榜
│   ├── stores/             # Pinia 状态管理
│   └── plugins/            # Nuxt 插件
└── docker-compose.yml
```

---

_最后更新: 2026-04-25 21:10_
