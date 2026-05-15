const crypto = require('crypto');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function hashPassword(password) {
  return md5(password + 'heartchain_salt');
}

// 数据库中的哈希值
const dbHashes = {
  '+8210test001': '$2b$10$8/HEUfui7ZOzpBlSbsyFc.Q3qoB34/aqKHre9OuwWdijgkKK9eS1C',
  '+821098765432': '4988dd6405a5d97a47a2a74bf81fd357',
  '+821022098999': 'a960e75da80032b2527dc58c28c4568c',
};

// 测试一些常见密码
const testPasswords = [
  'password123',
  '123456',
  'test123',
  'admin123',
  'qwer1234',
  'password',
  '12345678',
  'asdf1234',
  '000000',
  '111111',
];

console.log('测试密码破解:\n');
testPasswords.forEach(pwd => {
  const hash = hashPassword(pwd);
  Object.entries(dbHashes).forEach(([phone, dbHash]) => {
    if (hash === dbHash) {
      console.log(`✅ 手机号: ${phone}`);
      console.log(`   密码: ${pwd}`);
      console.log(`   Hash: ${hash}\n`);
    }
  });
});

console.log('\n所有测试密码的哈希值:');
testPasswords.forEach(pwd => {
  console.log(`  "${pwd}" -> ${hashPassword(pwd)}`);
});
