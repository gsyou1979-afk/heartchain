const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`HTTP ${res.statusCode}:`, JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('Raw response:', responseData);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function test() {
  const phone = '+821098765432';
  const code = '123456';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjllNDMyMi1hYmQyLTQ0OTgtOTk5YS1hODg3YzRkM2QwM2YiLCJwaG9uZSI6Iis4MjEwOTg3NjU0MzIiLCJpYXQiOjE3NzcxMDUyMjIsImV4cCI6MTc3NzcwMDAyMn0.123';

  // 发布任务
  console.log('=== 发布任务 ===');
  await request('POST', '/api/v1/tasks', {
    title: '测试任务123',
    taskType: 'single_once',
    requiredSkills: ['medical', 'driving'],
    description: '这是一个测试任务',
    location: '首尔',
    pointsReward: 75
  }, token);

  // 获取任务列表
  console.log('\n=== 获取任务列表 ===');
  await request('GET', '/api/v1/tasks');
}

test().catch(console.error);
