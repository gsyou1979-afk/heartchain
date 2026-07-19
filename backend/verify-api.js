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
  // 登录
  const login = await request('POST', '/auth/password-login', { 
    phone: '+821022098999', 
    password: 'asdf123' 
  });
  
  const token = login.body.accessToken;
  console.log('✅ 登录成功');
  console.log('   用户技能:', login.body.user.skills);
  console.log('   用户学历:', JSON.stringify(login.body.user.education));
  
  // 获取用户信息
  const user = await request('GET', '/users/me', null, token);
  console.log('\n👤 /users/me 返回:');
  console.log('   技能:', user.body.skills);
  console.log('   学历:', JSON.stringify(user.body.education));
  
  // 发布任务测试
  const task = await request('POST', '/tasks', {
    title: '测试任务',
    taskType: 'single_once',
    requiredSkills: user.body.skills, // 使用用户的技能
    description: '测试发布功能',
    pointsReward: 50
  }, token);
  
  console.log('\n📋 发布任务状态:', task.status);
  if (task.status === 201) {
    console.log('   ✅ 任务发布成功!');
    console.log('   所需技能:', task.body.requiredSkills);
  }
  
  // 获取任务列表
  const tasks = await request('GET', '/tasks', null, token);
  console.log('\n📝 任务列表:');
  console.log('   总数:', tasks.body.total);
  if (tasks.body.items && tasks.body.items.length > 0) {
    console.log('   最新任务:', tasks.body.items[0].title);
    console.log('   所需技能:', tasks.body.items[0].requiredSkills);
  }
}

main().catch(console.error);