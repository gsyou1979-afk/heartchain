const http = require('http');

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:3000');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      console.log('Request body:', JSON.stringify(data));
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test() {
  try {
    // 1. 登录
    const loginRes = await request('POST', '/api/v1/auth/password-login', {
      phone: '+821022098999',
      password: 'asdf123'
    });
    console.log('登录:', loginRes.status);
    if (!loginRes.data.accessToken) {
      console.log('登录失败');
      return;
    }
    const token = loginRes.data.accessToken;

    // 2. 测试不同的数据格式
    console.log('\n=== 测试1: 只传必要字段 ===');
    const task1 = {
      title: '测试任务1',
      taskType: 'single_once',
      requiredSkills: ['repair'],
      reward: 100
    };
    const r1 = await request('POST', '/api/v1/tasks', task1, token);
    console.log('状态:', r1.status);
    console.log('响应:', JSON.stringify(r1.data));

    console.log('\n=== 测试2: 传所有字段 ===');
    const task2 = {
      title: '测试任务2',
      description: '描述',
      taskType: 'single_once',
      requiredSkills: ['repair', 'driving'],
      location: '首尔',
      schedule: {
        type: 'once',
        date: '2026-04-26',
        startTime: '09:00',
        endTime: '17:00'
      },
      reward: 100
    };
    const r2 = await request('POST', '/api/v1/tasks', task2, token);
    console.log('状态:', r2.status);
    console.log('响应:', JSON.stringify(r2.data));

    console.log('\n=== 测试3: schedule 传字符串 ===');
    const task3 = {
      title: '测试任务3',
      taskType: 'single_once',
      requiredSkills: ['repair'],
      reward: 100,
      schedule: '{"type":"once","date":"2026-04-26"}'
    };
    const r3 = await request('POST', '/api/v1/tasks', task3, token);
    console.log('状态:', r3.status);
    console.log('响应:', JSON.stringify(r3.data));

  } catch (err) {
    console.error('错误:', err.message);
  }
}

test();
