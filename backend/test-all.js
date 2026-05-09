const http = require('http');

function httpRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  try {
    // 1. 登录
    console.log('=== 1. 登录 ===');
    const loginRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/auth/password-login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { phone: '+821098765432', password: 'password123' });
    
    const loginData = JSON.parse(loginRes.body);
    const token = loginData.access_token;
    console.log('状态:', loginRes.status);
    console.log('用户信息:', JSON.stringify(loginData.user, null, 2));
    console.log('用户技能:', loginData.user?.skills);
    
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    
    // 2. 获取任务列表
    console.log('\n=== 2. 获取任务列表 ===');
    const tasksRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/tasks',
      method: 'GET',
      headers
    });
    console.log('状态:', tasksRes.status);
    const tasksData = JSON.parse(tasksRes.body);
    console.log('任务数量:', tasksData.items?.length || tasksData.length);
    console.log('任务:', JSON.stringify(tasksData.items?.slice(0,2) || tasksData.slice(0,2), null, 2));
    
    // 3. 更新用户技能
    console.log('\n=== 3. 更新用户技能 ===');
    const updateRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/me',
      method: 'PUT',
      headers
    }, { skills: ['medical', 'tech', 'design'] });
    console.log('状态:', updateRes.status);
    const updateData = JSON.parse(updateRes.body);
    console.log('更新后技能:', updateData.skills);
    
    // 4. 添加学历
    console.log('\n=== 4. 添加学历 ===');
    const eduRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/me',
      method: 'PUT',
      headers
    }, { 
      education: [{ level: 'bachelor', school: '首尔大学', year: '2020' }]
    });
    console.log('状态:', eduRes.status);
    const eduData = JSON.parse(eduRes.body);
    console.log('学历信息:', eduData.education);
    
    // 5. 获取用户信息验证学历
    console.log('\n=== 5. 获取用户信息 ===');
    const userRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/me',
      method: 'GET',
      headers
    });
    console.log('状态:', userRes.status);
    const userData = JSON.parse(userRes.body);
    console.log('技能:', userData.skills);
    console.log('学历:', userData.education);
    
    console.log('\n✅ 所有测试完成');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
}

main();