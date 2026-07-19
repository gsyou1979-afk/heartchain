const crypto = require('crypto');

// 测试密码哈希
function hashPassword(password) {
  return crypto.createHash('md5').update(password + 'heartchain_salt').digest('hex');
}

console.log('password123:', hashPassword('password123'));
console.log('test1234:', hashPassword('test1234'));
