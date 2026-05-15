/**
 * HeartChain 密码重置 & 忘记密码 — 完整修改方案
 * 
 * 1. 密码重置：所有老用户MD5密码 → bcrypt加密的统一初始密码
 * 2. 忘记密码：通过手机验证码重置密码
 * 
 * 初始密码：HeartChain2026!
 */

// ============================================
// 第一步：在 backend 目录下运行此脚本重置密码
// node scripts/reset-passwords.js
// ============================================

const bcrypt = require('bcryptjs');

async function generateResetSQL() {
  const NEW_PASSWORD = 'HeartChain2026!';
  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
  
  console.log('=== 密码重置SQL ===');
  console.log(`-- 初始密码：${NEW_PASSWORD}`);
  console.log(`-- 请用户在首次登录后立即修改密码！`);
  console.log('');
  console.log(`UPDATE users SET password = '${hashedPassword}' WHERE password NOT LIKE '$2b$%';`);
  console.log('');
  console.log('=== 验证SQL ===');
  console.log("SELECT id, phone, nickname, CASE WHEN password LIKE '$2b$%' THEN 'bcrypt' ELSE 'MD5/其他' END as pwd_type FROM users;");
  
  return { hashedPassword, newPassword: NEW_PASSWORD };
}

generateResetSQL().catch(console.error);
