-- Migration: 2025-05-20 - Add media_assets table and update ad_placements
-- Run this on your production PostgreSQL database

-- 1. Create media_assets table
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "uploaderId" UUID REFERENCES users(id) ON DELETE SET NULL,
  "fileName" VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  "mimeType" VARCHAR(50),
  size INTEGER,
  storage VARCHAR(100),
  "publicId" VARCHAR(255),
  "assetType" VARCHAR(50) DEFAULT 'image',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. Update ad_placements: migrate B1/B2 to A2/A3
UPDATE ad_placements SET code = 'A2', name = '左侧-上', position = 'left-top', width = 300, height = 250, description = '左侧边栏上方广告' WHERE code = 'B1';
UPDATE ad_placements SET code = 'A3', name = '左侧-下', position = 'left-bottom', width = 300, height = 250, description = '左侧边栏下方广告' WHERE code = 'B2';

-- 3. Insert new placements if they don't exist
INSERT INTO ad_placements (id, code, name, description, platform, page, position, width, height, "supportedTypes", "floorCpm", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'A2', '左侧-上', '左侧边栏上方广告', 'web', 'home', 'left-top', 300, 250, '["commercial", "public_service"]', 30.00, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM ad_placements WHERE code = 'A2');

INSERT INTO ad_placements (id, code, name, description, platform, page, position, width, height, "supportedTypes", "floorCpm", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'A3', '左侧-下', '左侧边栏下方广告', 'web', 'home', 'left-bottom', 300, 250, '["commercial", "public_service"]', 20.00, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM ad_placements WHERE code = 'A3');

-- 4. Update ad_creatives foreign key to add ON DELETE CASCADE
ALTER TABLE ad_creatives DROP CONSTRAINT IF EXISTS "FK_a84f8700428094da5ddd0568c3e";
ALTER TABLE ad_creatives ADD CONSTRAINT "FK_ad_creatives_campaign" FOREIGN KEY ("campaignId") REFERENCES ad_campaigns(id) ON DELETE CASCADE;
