/**
 * 샘플 태스크 생성 스크립트
 */
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const db = new sqlite3.Database('./heartchain.sqlite');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// 먼저 관리자 ID 가져오기
db.get("SELECT id FROM users WHERE role='admin' LIMIT 1", (err, admin) => {
  if (err || !admin) {
    console.error('관리자 계정 없음:', err);
    db.close();
    return;
  }
  
  const now = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  
  const tasks = [
    {
      id: uuidv4(),
      title: '노인복지관 청소 봉사',
      description: '지역 노인복지관 청소 및 정리 봉사활동입니다. 어르신들을 위해 밝고 깨끗한 환경을 만들어 주세요!',
      taskType: 'single_once',
      status: 'open',
      pointsReward: 50,
      location: '서울 강남구 노인복지관',
      publisherId: admin.id,
      schedule: JSON.stringify({ type: 'once', date: tomorrow, startTime: '09:00', endTime: '12:00' }),
    },
    {
      id: uuidv4(),
      title: '어린이 도서관 독서 지도',
      description: '초등학교 저학년 어린이들을 위한 독서 지도 봉사. 책 읽어주기 및 독후감 작성 도움.',
      taskType: 'single_multi',
      status: 'open',
      pointsReward: 80,
      location: '부산 해운대구 어린이 도서관',
      publisherId: admin.id,
      schedule: JSON.stringify({ type: 'range', startDate: tomorrow, endDate: nextWeek }),
    },
    {
      id: uuidv4(),
      title: '환경 정화 캠페인 (팀)',
      description: '한강 공원 쓰레기 줍기 캠페인입니다. 팀을 이루어 함께 환경을 지켜요!',
      taskType: 'team_once',
      status: 'open',
      pointsReward: 100,
      location: '서울 한강공원 여의도',
      teamSize: 10,
      publisherId: admin.id,
      schedule: JSON.stringify({ type: 'once', date: nextWeek, startTime: '10:00', endTime: '14:00' }),
    },
  ];
  
  let done = 0;
  for (const task of tasks) {
    db.run(
      `INSERT OR REPLACE INTO tasks 
        (id, title, description, taskType, status, pointsReward, location_text, publisher_id, schedule, teamsize, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task.id, task.title, task.description, task.taskType, task.status, 
       task.pointsReward, task.location, task.publisherId, task.schedule, 
       task.teamSize || null, now, now],
      function(err) {
        if (err) console.error('❌ 태스크 생성 실패:', err.message);
        else console.log('✅ 태스크 생성:', task.title);
        done++;
        if (done === tasks.length) {
          db.all('SELECT title, taskType, status, pointsReward FROM tasks', (err2, rows) => {
            if (!err2) {
              console.log('\n📋 현재 태스크 목록:');
              rows.forEach(r => console.log(`  - ${r.title} [${r.taskType}] ${r.pointsReward}HRT`));
            }
            db.close();
          });
        }
      }
    );
  }
});
