-- 将所有用户密码重置为 Admin@2026 的 bcrypt 哈希
-- 在 Render Dashboard > Database > Connect > psql 中执行

UPDATE users SET password = '$2b$12$/h0SZ0MQF1PBA3S7Tzi57OiSgPYvDOPxCC0xq1ic.dpb0dPRVeA1u';

-- 验证
SELECT id, phone, nickname, LEFT(password, 20) as password_prefix FROM users;
