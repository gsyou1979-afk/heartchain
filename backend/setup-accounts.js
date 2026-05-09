/**
 * 테스트 계정 및 관리자 계정 생성 스크립트 (MD5 해시 방식)
 * 백엔드 auth.service.ts: md5(password + 'heartchain_salt') 사용
 */
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const db = new sqlite3.Database('./heartchain.sqlite');

function md5Hash(password) {
  return crypto.createHash('md5').update(password + 'heartchain_salt').digest('hex');
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const accounts = [
  {
    id: uuidv4(),
    phone: '+821098765432',
    password: 'password123',
    nickname: '테스트사용자',
    role: 'volunteer',
    region: 'Seoul',
    creditScore: 100,
    pointBalance: 500,
  },
  {
    id: uuidv4(),
    phone: '+821022098999',
    password: 'Admin@2026',
    nickname: '관리자',
    role: 'admin',
    region: 'Seoul',
    creditScore: 100,
    pointBalance: 9999,
  },
];

const now = new Date().toISOString();
let done = 0;

for (const acc of accounts) {
  const hashedPassword = md5Hash(acc.password);
  
  db.run(
    `INSERT OR REPLACE INTO users 
      (id, phone, password, nickname, role, region, creditScore, pointBalance, phoneVerified, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'active', ?, ?)`,
    [acc.id, acc.phone, hashedPassword, acc.nickname, acc.role, acc.region, acc.creditScore, acc.pointBalance, now, now],
    function(err) {
      if (err) {
        console.error(`❌ ${acc.phone} 생성 실패:`, err.message);
      } else {
        console.log(`✅ 계정 생성: ${acc.phone} (${acc.nickname}) [${acc.role}]`);
        console.log(`   비밀번호 해시: ${hashedPassword.substring(0,16)}...`);
      }
      done++;
      if (done === accounts.length) {
        db.all('SELECT id, phone, nickname, role, pointBalance FROM users', (err2, rows) => {
          if (err2) console.error(err2);
          else {
            console.log('\n📋 현재 사용자 목록:');
            rows.forEach(r => console.log(`  - ${r.phone} | ${r.nickname} | ${r.role} | ${r.pointBalance}HRT`));
          }
          db.close();
        });
      }
    }
  );
}
