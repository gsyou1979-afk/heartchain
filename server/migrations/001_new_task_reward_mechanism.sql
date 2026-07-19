-- ============================================================
-- HeartChain 신규 작업 발행 메커니즘 마이그레이션
-- ============================================================

-- 1. tasks 테이블에 baseReward / bonusReward 컬럼 추가
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS "baseReward" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "bonusReward" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "educationLevel" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "estimatedHours" DECIMAL(6,2) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "requiredCreditScore" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "requiredExperience" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "bonusReserved" BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. users 테이블에 reservedBalance 컬럼 추가
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS "reservedBalance" INTEGER NOT NULL DEFAULT 0;

-- 3. transactions 테이블 type 확장
--    기존 CHECK 제약조건이 있다면 제거 후 재생성
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS "transactions_type_check";

ALTER TABLE transactions
  ADD CONSTRAINT "transactions_type_check"
    CHECK ("type" IN (
      'income', 'expense', 'recharge', 'withdraw',
      'mint', 'bonus', 'transfer', 'refund', 'reserve', 'release'
    ));

-- 4. 인플레이션 상한 관련 코드 제거
--    (별도 테이블/제약조건이 있다면 여기서 DROP)
--    예: DROP TABLE IF EXISTS mint_cap;

COMMENT ON COLUMN tasks."baseReward" IS '플랫폼 가치 평가 엔진이 산정한 기본 보상 포인트';
COMMENT ON COLUMN tasks."bonusReward" IS '발행인이 선택적으로 추가한 보상 포인트';
COMMENT ON COLUMN tasks."bonusReserved" IS '추가 보상 동결 여부';
COMMENT ON COLUMN users."reservedBalance" IS '추가 보상으로 동결된 잔고';
