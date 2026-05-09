// 测试韩文任务发布
const API = 'http://localhost:3000/api/v1';

async function test() {
  // 1. 密码登录
  const loginRes = await fetch(`${API}/auth/password-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+821022098999', password: 'asdf123' })
  }).then(r => r.json());
  
  console.log('登录响应:', loginRes.user?.nickname || '登录失败');
  
  const token = loginRes.accessToken;
  if (!token) {
    console.log('登录失败:', loginRes.message);
    return;
  }
  
  // 2. 创建韩文任务
  const task = {
    title: '서울 음식 배달志愿服务',
    description: '서울시 내 작은 식당에서 음식을 배달하는 따뜻한志愿服务입니다.',
    taskType: 'single_once',
    location: '서울 강남구',
    pointsReward: 50,
    requiredSkills: ['driving'],
    schedule: {
      type: 'once',
      date: '2026-04-28',
      startTime: '10:00',
      endTime: '14:00'
    }
  };
  
  const createRes = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(task)
  }).then(r => r.json());
  
  console.log('\n创建响应:');
  console.log('- ID:', createRes.id);
  console.log('- 标题:', createRes.title);
  console.log('- 类型:', typeof createRes.title);
  
  // 3. 获取列表验证
  const listRes = await fetch(`${API}/tasks`).then(r => r.json());
  console.log('\n任务大厅:');
  listRes.items.forEach(t => {
    console.log(`- ${t.title}`);
  });
}

test().catch(console.error);
