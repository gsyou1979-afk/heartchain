import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdSystem1700000000001 implements MigrationInterface {
  name = 'AddAdSystem1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建广告位配置表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_placements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" varchar(50) UNIQUE NOT NULL,
        "name" varchar(100) NOT NULL,
        "description" text,
        "platform" varchar(20) NOT NULL,
        "page" varchar(100) NOT NULL,
        "position" varchar(50) NOT NULL,
        "width" int NOT NULL,
        "height" int NOT NULL,
        "supported_types" varchar[],
        "floor_cpm" decimal(10,2) DEFAULT 0,
        "is_active" boolean DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ad_placements" PRIMARY KEY ("id")
      )
    `);

    // 创建商业广告计划表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_campaigns" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "advertiser_id" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "ad_type" varchar(20) DEFAULT 'commercial',
        "status" varchar(20) DEFAULT 'draft',
        "pricing_model" varchar(10) NOT NULL,
        "budget_daily" decimal(12,2),
        "budget_total" decimal(12,2),
        "spent" decimal(12,2) DEFAULT 0,
        "start_date" date NOT NULL,
        "end_date" date,
        "targeting" jsonb,
        "placements" varchar[],
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ad_campaigns" PRIMARY KEY ("id")
      )
    `);

    // 创建商业广告素材表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_creatives" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "campaign_id" uuid REFERENCES "ad_campaigns"("id"),
        "title" varchar(200),
        "description" text,
        "image_url" varchar(500),
        "video_url" varchar(500),
        "landing_url" varchar(1000) NOT NULL,
        "creative_type" varchar(30) NOT NULL,
        "width" int,
        "height" int,
        "status" varchar(20) DEFAULT 'pending',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ad_creatives" PRIMARY KEY ("id")
      )
    `);

    // 创建项目广告表（求助广告）
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "project_ads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "title" varchar(200) NOT NULL,
        "description" text,
        "image_url" varchar(500),
        "landing_url" varchar(1000) NOT NULL,
        "geo_target" jsonb,
        "interest_target" varchar[],
        "priority_score" decimal(5,2),
        "urgency" varchar(10) DEFAULT 'normal',
        "quota_total" int DEFAULT 10000,
        "quota_used" int DEFAULT 0,
        "status" varchar(20) DEFAULT 'active',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project_ads" PRIMARY KEY ("id")
      )
    `);

    // 创建广告曝光记录表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_impressions" (
        "id" bigserial PRIMARY KEY,
        "ad_type" varchar(20) NOT NULL,
        "creative_id" uuid,
        "project_ad_id" uuid REFERENCES "project_ads"("id"),
        "placement_code" varchar(50) NOT NULL,
        "user_id" uuid,
        "device_id" varchar(200),
        "ip" inet,
        "geo_city" varchar(100),
        "geo_school" varchar(200),
        "user_agent" text,
        "is_viewable" boolean DEFAULT false,
        "view_duration" int DEFAULT 0,
        "source" varchar(30),
        "dsp_id" varchar(50),
        "bid_price" decimal(10,4),
        "win_price" decimal(10,4),
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    // 创建广告点击记录表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_clicks" (
        "id" bigserial PRIMARY KEY,
        "impression_id" bigint REFERENCES "ad_impressions"("id"),
        "ad_type" varchar(20) NOT NULL,
        "creative_id" uuid,
        "project_ad_id" uuid REFERENCES "project_ads"("id"),
        "placement_code" varchar(50),
        "user_id" uuid,
        "landing_url" varchar(1000),
        "is_bot" boolean DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    // 创建项目广告转化记录表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "project_ad_conversions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_ad_id" uuid REFERENCES "project_ads"("id"),
        "impression_id" bigint REFERENCES "ad_impressions"("id"),
        "click_id" bigint REFERENCES "ad_clicks"("id"),
        "user_id" uuid,
        "conversion_type" varchar(20) NOT NULL,
        "converted_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project_ad_conversions" PRIMARY KEY ("id")
      )
    `);

    // 创建用户标签表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_tags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "tag_category" varchar(50) NOT NULL,
        "tag_key" varchar(100) NOT NULL,
        "tag_value" varchar(200) NOT NULL,
        "confidence" decimal(3,2) DEFAULT 1.0,
        "source" varchar(30) DEFAULT 'inferred',
        "expires_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_tags" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_tags" UNIQUE ("user_id", "tag_key", "tag_value")
      )
    `);

    // 创建频次控制表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_frequencies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "ad_type" varchar(20),
        "creative_id" uuid,
        "campaign_id" uuid,
        "project_ad_id" uuid,
        "date" date NOT NULL,
        "impressions" int DEFAULT 0,
        "clicks" int DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ad_frequencies" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_ad_frequencies" UNIQUE ("user_id", "creative_id", "date")
      )
    `);

    // 创建投放日志表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ad_serving_logs" (
        "id" bigserial PRIMARY KEY,
        "request_id" varchar(100),
        "placement_code" varchar(50) NOT NULL,
        "ad_type" varchar(20),
        "creative_id" uuid,
        "project_ad_id" uuid,
        "user_id" uuid,
        "device_id" varchar(200),
        "ip" inet,
        "geo_city" varchar(100),
        "response_time_ms" int,
        "is_served" boolean DEFAULT false,
        "reject_reason" varchar(200),
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    // 插入默认广告位配置
    await queryRunner.query(`
      INSERT INTO "ad_placements" ("code", "name", "description", "platform", "page", "position", "width", "height", "supported_types", "floor_cpm") VALUES
      ('A1', '首页Hero横幅', '首页首屏导航下方轮播横幅', 'web', 'home', 'hero', 1200, 400, ARRAY['commercial', 'public_service', 'project'], 80.00),
      ('B1', '左侧竖幅', '左侧栏顶部竖幅广告', 'web', 'home', 'sidebar', 300, 600, ARRAY['commercial', 'public_service'], 30.00),
      ('B2', '左侧矩形', '左侧栏中部矩形广告', 'web', 'home', 'sidebar', 300, 250, ARRAY['commercial', 'public_service'], 20.00),
      ('C1', '信息流原生广告1', '内容流中穿插原生广告', 'web', 'home', 'feed', 580, 300, ARRAY['commercial', 'project'], 0.50),
      ('C2', '信息流原生广告2', '内容流中穿插原生广告', 'web', 'home', 'feed', 580, 300, ARRAY['commercial', 'project'], 0.50),
      ('D1', '底部通栏', '页面底部Footer上方横幅', 'web', 'home', 'footer', 1200, 150, ARRAY['commercial'], 15.00),
      ('MA1', '开屏广告', 'App启动时全屏广告', 'android', 'splash', 'splash', 1080, 1920, ARRAY['commercial'], 200.00),
      ('MB1', '首页信息流', 'App首页活动列表中广告', 'android', 'home', 'feed', 1080, 540, ARRAY['commercial', 'public_service', 'project'], 0.80)
      ON CONFLICT ("code") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_serving_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_frequencies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_tags"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_ad_conversions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_clicks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_impressions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_ads"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_creatives"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_campaigns"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ad_placements"`);
  }
}
