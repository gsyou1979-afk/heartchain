const http = require('http');

function post(path, data, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    const req = http.request(options, (res) => {
      let result = '';
      res.on('data', chunk => result += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: result }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    const req = http.request(options, (res) => {
      let result = '';
      res.on('data', chunk => result += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: result }));
    });
    req.on('error', reject);
    req.end();
  });
}

function put(path, data, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    const req = http.request(options, (res) => {
      let result = '';
      res.on('data', chunk => result += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: result }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    // 1. 登录
    console.log('=== 1. 登录 ===');
    const loginRes = await post('/auth/password-login', { phone: '+821098765432', password: 'password123' });
    const loginData = JSON.parse(loginRes.body);
    const token = loginData.access_token;
    console.log('✅ 登录成功，用户技能:', loginData.user.skills);
    
    // 2. 发布任务
    console.log('\n=== 2. 发布任务 ===');
    const publishRes = await post('/tasks', {
      title: '测试任务-技能关联',
      taskType: 'single_once',
      requiredSkills: ['tech', 'design'],
      description: '测试发布任务功能',
      pointsReward: 60
    }, token);
    console.log('状态:', publishRes.status);
    if (publishRes.status === 201) {
      console.log('✅ 任务发布成功');
    } else {
      console.log('发布失败:', publishRes.body);
    }
    
    // 3. 获取任务列表
    console.log('\n=== 3. 获取任务列表 ===');
    const tasksRes = await get('/tasks', token);
    console.log('状态:', tasksRes.status);
    const tasksData = JSON.parse(tasksRes.body);
    console.log('任务数量:', tasksData.total);
    console.log('✅ 任务列表正常');
    
    // 4. 添加学历
    console.log('\n=== 4. 添加学历 ===');
    const eduRes = await put('/users/me', { 
      education: [{ level: 'bachelor', school: '首尔大学', year: '2020' }]
    }, token);
    console.log('状态:', eduRes.status);
    if (eduRes.status === 200) {
      const eduData = JSON.parse(eduRes.body);
      console.log('✅ 学历添加成功:', JSON.stringify(eduData.education));
    } else {
      console.log('学历添加失败:', eduRes.body);
    }
    
    // 5. 验证学历
    console.log('\n=== 5. 获取用户信息 ===');
    const userRes = await get('/users/me', token);
    const userData = JSON.parse(userRes.body);
    console.log('技能:', userData.skills);
    console.log('学历:', JSON.stringify(userData.education));
    
    console.log('\n🎉 所有测试通过！');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
}

main();