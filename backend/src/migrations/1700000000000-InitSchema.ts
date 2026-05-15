import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建枚举类型
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_role" AS ENUM ('volunteer', 'organization', 'skill_provider', 'donor', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'banned');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "task_status" AS ENUM ('draft', 'open', 'in_progress', 'submitted', 'completed', 'cancelled', 'disputed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 创建 users 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "phone" varchar(20) NOT NULL UNIQUE,
        "password" varchar(100),
        "nickname" varchar(50),
        "avatar" varchar(500),
        "email" varchar(100),
        "role" "user_role" NOT NULL DEFAULT 'volunteer',
        "status" "user_status" NOT NULL DEFAULT 'active',
        "creditScore" int NOT NULL DEFAULT 0,
        "pointBalance" decimal(18,6) NOT NULL DEFAULT 0,
        "walletAddress" varchar(42),
        "realName" varchar(18),
        "idCard" varchar(18),
        "phoneVerified" boolean NOT NULL DEFAULT false,
        "realNameVerified" boolean NOT NULL DEFAULT false,
        "region" varchar(50),
        "bio" varchar(255),
        "skills" jsonb,
        "education" jsonb,
        "agreePromotional" boolean NOT NULL DEFAULT false,
        "language" varchar(20),
        "location" jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // 创建 tasks 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(100) NOT NULL,
        "description" text,
        "taskType" varchar(20),
        "status" varchar(20) NOT NULL DEFAULT 'open',
        "requiredSkills" jsonb,
        "location" jsonb,
        "schedule" jsonb,
        "pointsReward" int NOT NULL DEFAULT 0,
        "volunteerCount" int NOT NULL DEFAULT 1,
        "region" varchar(20),
        "publisher_id" uuid NOT NULL,
        "assignee_id" uuid,
        "viewCount" int NOT NULL DEFAULT 0,
        "proofEvidence" jsonb,
        "proofsSubmitted" int NOT NULL DEFAULT 0,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_publisher" FOREIGN KEY ("publisher_id") REFERENCES "users"("id"),
        CONSTRAINT "FK_tasks_assignee" FOREIGN KEY ("assignee_id") REFERENCES "users"("id")
      )
    `);

    // 创建 points 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "point_transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" varchar(20) NOT NULL,
        "status" varchar(20) DEFAULT 'pending',
        "amount" decimal(18,6) NOT NULL,
        "description" text,
        "from_user_id" uuid NOT NULL,
        "to_user_id" uuid NOT NULL,
        "task_id" uuid,
        "donation_id" uuid,
        "team_id" uuid,
        "tx_hash" varchar(66),
        "block_number" int,
        "endorsements" jsonb,
        "from_user_balance" decimal(18,6) DEFAULT 0,
        "to_user_balance" decimal(18,6) DEFAULT 0,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_point_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_point_transactions_from_user" FOREIGN KEY ("from_user_id") REFERENCES "users"("id"),
        CONSTRAINT "FK_point_transactions_to_user" FOREIGN KEY ("to_user_id") REFERENCES "users"("id")
      )
    `);

    // 创建 teams 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "teams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "description" text,
        "avatar" varchar(500),
        "leaderId" uuid NOT NULL,
        "region" varchar(20),
        "memberCount" int NOT NULL DEFAULT 0,
        "totalPoints" decimal(18,6) NOT NULL DEFAULT 0,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_teams" PRIMARY KEY ("id"),
        CONSTRAINT "FK_teams_leader" FOREIGN KEY ("leaderId") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "team_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "teamId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "role" varchar(20) NOT NULL DEFAULT 'member',
        "joinedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_team_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_team_members_team" FOREIGN KEY ("teamId") REFERENCES "teams"("id"),
        CONSTRAINT "FK_team_members_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);

    // 创建 notifications 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "type" varchar(50) NOT NULL,
        "title" varchar(200) NOT NULL,
        "content" text,
        "data" jsonb,
        "read" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);

    // 创建索引
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_status" ON "tasks" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_publisher" ON "tasks" ("publisher_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_assignee" ON "tasks" ("assignee_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_notifications_user" ON "notifications" ("userId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_point_transactions_from_user" ON "point_transactions" ("from_user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_point_transactions_to_user" ON "point_transactions" ("to_user_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "team_members" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "teams" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "point_transactions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "task_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role"`);
  }
}