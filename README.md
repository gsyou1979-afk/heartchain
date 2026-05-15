# HeartChain (哈特链)

> Blockchain-based Volunteer Service Platform
> 区块链好人好事记录平台

## Project Structure

```
heartchain/
├── backend/          # NestJS API Server
│   ├── src/
│   │   ├── auth/            # Authentication (JWT + SMS)
│   │   ├── users/           # User management
│   │   ├── tasks/           # Task system
│   │   ├── points/          # HeartCoin (HRT) system
│   │   ├── teams/           # Team/organization
│   │   ├── notifications/   # Push notifications
│   │   └── common/          # Shared (guards, decorators, DTOs)
│   ├── .env.example
│   └── package.json
│
├── web/              # Nuxt.js Web Frontend
│   ├── components/   # Vue components
│   ├── composables/  # Shared composables
│   ├── layouts/      # Page layouts
│   ├── locales/      # i18n (zh, ko, en)
│   ├── pages/        # Pages (SSR)
│   ├── stores/       # Pinia stores
│   └── plugins/
│
├── app/              # Flutter Mobile App
│   └── lib/
│       ├── core/         # Network, storage, utils
│       ├── features/     # Feature modules
│       │   ├── auth/
│       │   ├── home/
│       │   ├── tasks/
│       │   ├── wallet/
│       │   ├── teams/
│       │   └── profile/
│       └── shared/       # Theme, widgets, models
│
├── docs/             # Project documentation
├── 哈特链项目说明方案.md
├── 哈特链项目执行计划.md
└── README.md
```

## Quick Start

### Backend (NestJS)

```bash
cd backend
cp .env.example .env    # Configure your environment
npm install
npm run start:dev        # Start at http://localhost:3000
# Swagger docs: http://localhost:3000/api/v1/docs
```

### Web Frontend (Nuxt.js)

```bash
cd web
npm install
npm run dev              # Start at http://localhost:3001
```

### Mobile App (Flutter)

```bash
cd app
flutter pub get
flutter run              # Run on device/emulator
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Nuxt.js 3 + Vue 3 + TailwindCSS |
| Mobile App | Flutter + Riverpod + GoRouter |
| Backend API | NestJS + TypeORM + PostgreSQL |
| Authentication | JWT + SMS (Aliyun/Kakao) |
| Blockchain | Polygon (Public) + Substrate (Compliance) |
| i18n | 中文 / 한국어 / English |

## API Endpoints

Base URL: `/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/sms/send` | Send SMS code |
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| GET | `/users/me` | Get current user |
| PUT | `/users/me` | Update profile |
| GET | `/tasks` | Query tasks |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get task detail |
| POST | `/tasks/:id/assign` | Accept task |
| POST | `/tasks/:id/proof` | Submit proof |
| POST | `/tasks/:id/complete` | Confirm completion |
| GET | `/points/balance` | Get HRT balance |
| GET | `/points/transactions` | Transaction history |
| POST | `/points/transfer` | Transfer HRT |
| GET | `/teams` | List teams |
| POST | `/teams` | Create team |
| POST | `/teams/join/:code` | Join team |
| GET | `/notifications` | Get notifications |

## Team

- **KP** — Flutter APP + Product + Testing
- **大秘** — Backend + Web + Blockchain + DevOps

## License

Private Project © 2026 HeartChain
