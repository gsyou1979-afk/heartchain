const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  const phone = '+821098765432';
  const code = '123456';

  // 登录
  console.log('=== 登录 ===');
  const loginRes = await post('/api/v1/auth/login', { phone, code });
  console.log(JSON.stringify(loginRes, null, 2));

  if (loginRes.accessToken) {
    const token = loginRes.accessToken;

    // 发布任务
    console.log('\n=== 发布任务 ===');
    const taskData = JSON.stringify({
      title: '测试任务456',
      taskType: 'single_once',
      requiredSkills: ['medical', 'driving'],
      description: '这是一个测试任务',
      location: '首尔',
      pointsReward: 75
    });

    const taskOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(taskData),
        'Authorization': `Bearer ${token}`
      }
    };

    const taskReq = http.request(taskOptions, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => console.log(`HTTP ${res.statusCode}:`, responseData));
    });
    taskReq.on('error', console.error);
    taskReq.write(taskData);
    taskReq.end();

    // 获取任务列表
    console.log('\n=== 获取任务列表 ===');
    const getReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/tasks',
      method: 'GET'
    }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => console.log(`HTTP ${res.statusCode}:`, responseData));
    });
    getReq.on('error', console.error);
    getReq.end();
  }
}

test().catch(console.error);
