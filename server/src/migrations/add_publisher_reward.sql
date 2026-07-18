-- HeartChain 积分规则升级迁移
-- 变更: 任务生成积分 + 发布人奖励积分
-- 日期: 2026-07-18

-- 1. tasks 表新增 publisher_reward 列（发布人奖励积分）
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS publisher_reward INTEGER DEFAULT 0;

-- 注释
COMMENT ON COLUMN tasks.publisher_reward IS '发布人奖励积分（任务完成后由平台铸造发放给发布人）';

-- 2. 验证
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'publisher_reward';
