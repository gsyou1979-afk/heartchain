-- 2026-05-25: 新增互助任务表（Help Requests）
-- 用于 GPS 定位的附近求助功能

CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'errand',
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address VARCHAR(300),
  deadline_hours FLOAT DEFAULT 2,
  deadline TIMESTAMP,
  reward_amount INTEGER DEFAULT 0,
  points_reward INTEGER DEFAULT 100,
  accept_points BOOLEAN DEFAULT FALSE,
  anonymous BOOLEAN DEFAULT FALSE,
  images JSON,
  creator_id UUID NOT NULL REFERENCES users(id),
  helper_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- GPS 索引
CREATE INDEX IF NOT EXISTS idx_help_requests_location ON help_requests(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_type ON help_requests(type);
CREATE INDEX IF NOT EXISTS idx_help_requests_creator ON help_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_created ON help_requests(created_at DESC);
