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
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test() {
  try {
    // 1. 登录
    console.log('1. 登录...');
    const loginRes = await request('POST', '/api/v1/auth/password-login', {
      phone: '+821022098999',
      password: 'asdf123'
    });
    console.log('登录状态:', loginRes.status);
    if (loginRes.data.accessToken) {
      console.log('登录成功:', loginRes.data.user?.nickname);
    } else {
      console.log('登录失败:', loginRes.data);
      return;
    }
    const token = loginRes.data.accessToken;

    // 2. 发布任务
    console.log('\n2. 发布任务...');
    const taskData = {
      title: '测试任务中文',
      description: '这是测试任务的描述',
      taskType: 'single_once',
      schedule: {
        type: 'once',
        date: '2026-04-26',
        startTime: '09:00',
        endTime: '17:00'
      },
      location: '首尔市',
      requiredSkills: ['repair', 'driving'],
      reward: 100,
      rewardType: 'fixed'
    };
    console.log('发送数据:', JSON.stringify(taskData));

    const createRes = await request('POST', '/api/v1/tasks', taskData, token);
    console.log('发布状态:', createRes.status);
    console.log('发布响应:', JSON.stringify(createRes.data));

    // 3. 查询任务列表
    if (createRes.status === 201) {
      console.log('\n3. 查询任务大厅...');
      const listRes = await request('GET', '/api/v1/tasks?status=open&limit=50');
      console.log('查询状态:', listRes.status);
      console.log('任务数量:', listRes.data.total);
      console.log('任务列表:', JSON.stringify(listRes.data.items, null, 2));
    }

    console.log('\n✅ 测试完成!');
  } catch (err) {
    console.error('\n❌ 错误:', err.message);
  }
}

test();
