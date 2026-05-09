const http = require('http');

async function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    
    const req = http.request(options, (res) => {
      let result = '';
      res.on('data', chunk => result += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(result) });
        } catch {
          resolve({ status: res.statusCode, body: result });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  // 1. 登录
  const login = await request('POST', '/auth/password-login', { 
    phone: '+821098765432', 
    password: 'password123' 
  });
  const token = login.body.accessToken;
  console.log('1. 登录成功，Token:', token.substring(0, 30) + '...');
  console.log('   用户技能:', login.body.user.skills);
  
  // 2. 发布任务
  const publish = await request('POST', '/tasks', {
    title: '测试任务-技能关联',
    taskType: 'single_once',
    requiredSkills: ['tech', 'design'],
    description: '测试发布任务功能',
    pointsReward: 60
  }, token);
  console.log('\n2. 发布任务状态:', publish.status);
  if (publish.status === 201) {
    console.log('   ✅ 任务发布成功!');
  } else {
    console.log('   ❌ 发布失败:', JSON.stringify(publish.body));
  }
  
  // 3. 获取任务列表
  const tasks = await request('GET', '/tasks', null, token);
  console.log('\n3. 获取任务列表状态:', tasks.status);
  console.log('   任务数量:', tasks.body.total);
  
  // 4. 添加学历
  const edu = await request('PUT', '/users/me', {
    education: [{ level: 'bachelor', school: '首尔大学', year: '2020' }]
  }, token);
  console.log('\n4. 添加学历状态:', edu.status);
  if (edu.status === 200) {
    console.log('   ✅ 学历添加成功:', JSON.stringify(edu.body.education));
  } else {
    console.log('   ❌ 学历添加失败:', JSON.stringify(edu.body));
  }
  
  // 5. 获取用户信息验证
  const user = await request('GET', '/users/me', null, token);
  console.log('\n5. 获取用户信息状态:', user.status);
  console.log('   技能:', user.body.skills);
  console.log('   学历:', JSON.stringify(user.body.education));
}

main().catch(console.error);