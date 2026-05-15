# HeartChain (哈特链) 项目接管文档
# 生成时间: 2026-05-15
# 接管人: OWL (Hermes Agent)

---

## 1. 项目概览

**项目名称**: HeartChain (哈特链)
**项目位置**: E:\WorkBuddy\heartchain\
**商业模式**: 流量变现（会员数×活跃度=广告价值），非卖币/交易抽成
**目标客户**: 大学（帮助学生完成毕业所需志愿服务时长）
**核心使命**: 提高志愿者收入水平，打破"志愿服务=低收入"的固有观念

---

## 2. 技术架构

### 2.1 技术栈
- **后端**: NestJS + TypeORM + PostgreSQL/SQLite
- **前端**: Nuxt.js 3 + Vue 3 + Tailwind CSS + Pinia
- **移动端**: Flutter (app目录)
- **区块链**: ethers.js (可选，配置不完整时自动禁用)
- **API前缀**: /api/v1

### 2.2 服务端口
- **后端 API**: http://localhost:3002 (本地开发)
- **前端 (Nuxt)**: http://localhost:3004 (本地开发)
- **PM2配置**: ecosystem.config.js (后端3002, 前端3001)

### 2.3 部署信息
- **前端部署**: Vercel
  - 访问地址: https://heartchain-five.vercel.app/
- **后端部署**: Render (免费实例)
  - API地址: https://heartchain-backend.onrender.com/api/v1
  - Swagger文档: https://heartchain-backend.onrender.com/api/v1/docs
  - ⚠️ 免费实例有休眠机制，首次访问需要等待唤醒
- **数据库**: 
  - 本地开发: SQLite (heartchain.sqlite)
  - 生产环境: PostgreSQL (Render托管，通过DATABASE_URL连接)

---

## 3. 账号信息

### 3.1 测试账号
- **手机号**: +821****8999
- **密码**: Admin@2026
- **昵称**: TestUser
- **技能**: repair, driving, cleaning, translation, event, 투자유치

### 3.2 默认验证码
- 开发模式固定验证码: 123456

### 3.3 环境变量 (后端 .env)
```
PORT=3002
DB_PATH=./heartchain.sqlite
JWT_SECRET=heartc...2024 (被截断，需要确认完整值)
NODE_ENV=development
```

### 3.4 环境变量 (后端 .env.local)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=*** (被遮盖)
DB_DATABASE=heartchain
```

---

## 4. 项目模块

### 4.1 后端模块 (14个)
| 模块 | 说明 |
|------|------|
| auth | 认证（手机验证码+密码登录） |
| users | 用户管理（5种角色: volunteer/organization/skill_provider/donor/admin） |
| tasks | 任务管理（单人/团队任务） |
| points | 积分系统（HRT代币） |
| teams | 团队管理 |
| notifications | 通知系统 |
| web3 | 区块链集成（ethers.js） |
| admin | 管理后台 |
| ad-placement | 广告位管理 |
| ad-campaign | 广告活动 |
| ad-creative | 广告素材 |
| ad-project | 项目广告（求助类） |
| ad-serving | 广告投放引擎 |
| ad-targeting | 广告定向 |
| ad-report | 广告报告 |
| ad-item | 广告项 |

### 4.2 前端页面
| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | /index.vue | 含广告位A1/C1/D1 |
| 任务大厅 | /tasks/index.vue | 任务列表+发布 |
| 我的任务 | /mytasks.vue | 已接/已发任务 |
| 成就/钱包 | /wallet.vue | 积分+志愿证明下载 |
| 爱心榜 | /heart-board.vue | 公开排行榜 |
| 登录/注册 | /auth/ | 认证页面 |
| 个人中心 | /profile/ | 用户资料 |
| 设置 | /settings/ | 系统设置 |
| 团队 | /teams/ | 团队管理 |
| 管理后台 | /admin/ | 管理员页面 |

---

## 5. API端点

### 5.1 认证
- POST /api/v1/auth/send-sms - 发送验证码
- POST /api/v1/auth/register - 注册
- POST /api/v1/auth/login - 手机登录
- POST /api/v1/auth/password-login - 密码登录
- POST /api/v1/auth/refresh - 刷新Token

### 5.2 用户
- GET /api/v1/users/me - 获取当前用户
- PUT /api/v1/users/me - 更新用户信息
- GET /api/v1/users/:id - 获取用户详情

### 5.3 任务
- GET /api/v1/tasks - 任务列表
- POST /api/v1/tasks - 发布任务
- GET /api/v1/tasks/:id - 任务详情
- PUT /api/v1/tasks/:id - 更新任务
- POST /api/v1/tasks/:id/assign - 接单
- POST /api/v1/tasks/:id/proof - 提交证明
- POST /api/v1/tasks/:id/complete - 确认完成
- POST /api/v1/tasks/:id/cancel - 取消任务
- GET /api/v1/tasks/my - 我的任务

### 5.4 积分
- GET /api/v1/points/balance - 查询余额
- POST /api/v1/points/transfer - 转账
- GET /api/v1/points/transactions - 交易记录

### 5.5 广告
- POST /api/v1/ad/request - 请求广告
- POST /api/v1/ad/impression - 上报曝光
- POST /api/v1/ad/click - 上报点击
- POST /api/v1/ad/conversion - 上报转化

---

## 6. 关键配置

### 6.1 前端API地址
- 生产环境: https://heartchain-backend.onrender.com/api/v1
- 配置位置: web/nuxt.config.ts (runtimeConfig.public.apiBase)
- 配置位置: web/utils/api.ts (getApiUrl函数)

### 6.2 PM2配置 (ecosystem.config.js)
- 后端: node dist/main.js (端口3002)
- 前端: node .output/server/index.mjs (端口3001)
- 日志: backend/logs/out.log, backend/logs/err.log

### 6.3 Flutter应用 (app目录)
- 位置: E:\WorkBuddy\heartchain\app\
- Android配置: app/android/
- ⚠️ 未找到APK文件，可能需要构建

---

## 7. 已知问题

### 🔴 严重
1. **密码安全性**: 使用MD5+salt哈希，生产环境必须改用bcrypt
2. **固定验证码**: 开发模式验证码硬编码123456
3. **CORS配置**: origin: '*' 允许所有来源
4. **synchronize: true**: TypeORM自动同步数据库，生产环境应该用migration
5. **团队任务并发**: assignTask没有加锁，可能超员

### 🟡 中等
6. JSON字段手动序列化（requiredSkills、schedule等）
7. 缺少输入验证和错误处理
8. 前端stats数据硬编码
9. 大量调试脚本散落在根目录

### 🟢 小
10. 缺少单元测试
11. 合约ABI不完整
12. batch文件编码问题

---

## 8. 启动命令

### 8.1 本地开发
```bash
# 后端
cd E:\WorkBuddy\heartchain\backend
npm run start:dev

# 前端
cd E:\WorkBuddy\heartchain\web
npm run dev
```

### 8.2 PM2部署
```bash
cd E:\WorkBuddy\heartchain
pm2 start ecosystem.config.js
```

### 8.3 重新构建
```bash
# 后端
cd E:\WorkBuddy\heartchain\backend
npm run build
npm run start:prod

# 前端
cd E:\WorkBuddy\heartchain\web
npm run build
npm run preview
```

---

## 9. 数据库

### 9.1 主要数据表
- users - 用户表
- tasks - 任务表
- point_transactions - 积分交易表
- teams - 团队表
- team_members - 团队成员表
- notifications - 通知表
- ad_placements - 广告位表
- ad_campaigns - 广告活动表
- ad_creatives - 广告素材表
- ad_projects - 项目广告表
- ad_impressions - 广告曝光表
- ad_clicks - 广告点击表
- ad_frequencies - 广告频次表
- project_ad_conversions - 广告转化表
- user_tags - 用户标签表
- ad_items - 广告项表

### 9.2 关键Entity字段
**User**: id, phone, password, nickname, avatar, email, role, status, creditScore, pointBalance, walletAddress, realName, idCard, phoneVerified, realNameVerified, region, bio, skills, education, agreePromotional, language, location, adEnabled, adPreferences

**Task**: id, title, description, taskType, status, requiredSkills, location, schedule, pointsReward, volunteerCount, teamSize, currentParticipants, region, publisher, assignee, viewCount, proofEvidence, proofsSubmitted

---

## 10. 区块链配置

### 10.1 合约
- HRT代币合约: 地址从环境变量 HRT_CONTRACT_ADDRESS 读取
- TaskRegistry合约: 地址从环境变量 TASK_CONTRACT_ADDRESS 读取

### 10.2 环境变量（需要配置）
- BLOCKCHAIN_RPC_URL - RPC节点地址
- ADMIN_PRIVATE_KEY - 管理员私钥
- HRT_CONTRACT_ADDRESS - HRT合约地址
- TASK_CONTRACT_ADDRESS - TaskRegistry合约地址

### 10.3 当前状态
区块链功能默认禁用（配置不完整时自动降级为离线模式）

---

## 11. 文件位置汇总

| 文件 | 位置 |
|------|------|
| 项目根目录 | E:\WorkBuddy\heartchain\ |
| 后端源码 | E:\WorkBuddy\heartchain\backend\src\ |
| 前端源码 | E:\WorkBuddy\heartchain\web\ |
| Flutter应用 | E:\WorkBuddy\heartchain\app\ |
| 智能合约 | E:\WorkBuddy\heartchain\contracts\ |
| 后端配置 | E:\WorkBuddy\heartchain\backend\.env |
| 前端配置 | E:\WorkBuddy\heartchain\web\nuxt.config.ts |
| PM2配置 | E:\WorkBuddy\heartchain\ecosystem.config.js |
| 项目文档 | E:\WorkBuddy\heartchain\MEMORY.md |
| 开发计划 | E:\WorkBuddy\heartchain\HEARTCHAIN_DEVELOPMENT_PLAN.md |
| 后端日志 | E:\WorkBuddy\heartchain\backend\logs\ |
| 前端日志 | E:\WorkBuddy\heartchain\web\logs\ |

---

## 12. 接管检查清单

- [x] 项目结构已分析
- [x] 技术栈已确认
- [x] 部署信息已记录
- [x] 测试账号已记录
- [ ] 生产环境数据库连接需要确认
- [ ] Render环境变量需要确认（DATABASE_URL, JWT_SECRET等）
- [ ] Vercel部署状态需要确认
- [ ] Flutter APK需要构建
- [ ] 区块链合约地址需要确认
- [ ] 密码哈希需要升级为bcrypt
- [ ] 单元测试需要补充

---

## 13. 下一步行动

### 立即执行
1. 确认Render上的环境变量配置
2. 确认Vercel前端部署状态
3. 升级密码哈希为bcrypt
4. 修复CORS配置

### 短期（1周内）
5. 整理根目录调试脚本
6. 补充单元测试
7. 修复团队任务并发问题

### 中期（1个月内）
8. 数据库migration替代synchronize
9. Flutter APK构建
10. 区块链合约部署

---

## 14. 微信集成 (WeChat/iLink Bot)

### 14.1 配置信息
- **平台**: 微信个人号机器人 (Tencent iLink Bot API)
- **Account ID**: `e5e9ccd72872@im.bot`
- **Token**: `e5e9ccd72872@im.bot:060000052cbf1a6a3cd4051205a8ee333f1b87`
- **Base URL**: `https://ilinkai.weixin.qq.com`
- **User ID**: `o9cq801fA7TYSrxrG4LloVoFH-5Q@im.wechat`
- **状态**: ✅ 已连接，正常收发消息

### 14.2 当前问题
- Token从2026-04-27保存至今已过期
- Gateway每10分钟重试一次，持续报 "Session expired" 错误
- 无法收发微信消息

### 14.3 修复步骤
1. 运行 `hermes weixin qr-login` 获取二维码
2. 用微信扫描二维码完成登录
3. 获取新Token后更新到 `~/.hermes/.env` 的 `WEIXIN_TOKEN`
4. 重启Gateway: `hermes gateway restart`

### 14.4 环境变量
```
WEIXIN_ACCOUNT_ID=6166922def19@im.bot
WEIXIN_TOKEN=<需要重新获取>
WEIXIN_BASE_URL=https://ilinkai.weixin.qq.com
WEIXIN_CDN_BASE_URL=https://novac2c.cdn.weixin.qq.com/c2c
WEIXIN_DM_POLICY=open
WEIXIN_GROUP_POLICY=open
WEIXIN_ALLOW_ALL_USERS=false
WEIXIN_HOME_CHANNEL=o9cq801fA7TYSrxrG4LloVoFH-5Q@im.wechat
```

---

文档结束
