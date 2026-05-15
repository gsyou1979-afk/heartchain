const http = require('http');

function request(method, path, data, token) {
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
        console.log(`[${method}] ${path} -> ${res.statusCode}`);
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
  try {
    // 1. 登录获取token
    console.log('=== 登录获取Token ===');
    const login = await request('POST', '/auth/password-login', { 
      phone: '+821098765432', 
      password: 'password123' 
    });
    
    if (login.status !== 200) {
      console.log('登录失败:', login.body);
      return;
    }
    
    const token = login.body.access_token;
    console.log('Token:', token.substring(0, 50) + '...');
    
    // 2. 使用token获取用户信息
    console.log('\n=== 获取用户信息 ===');
    const user = await request('GET', '/users/me', null, token);
    console.log('用户信息:', user.body);
    
    // 3. 发布任务
    console.log('\n=== 发布任务 ===');
    const publish = await request('POST', '/tasks', {
      title: '测试任务',
      taskType: 'single_once',
      requiredSkills: ['tech'],
      pointsReward: 35
    }, token);
    console.log('发布结果:', publish.body);
    
    // 4. 获取任务列表
    console.log('\n=== 获取任务列表 ===');
    const tasks = await request('GET', '/tasks', null, token);
    console.log('任务列表:', tasks.body);
    
  } catch (err) {
    console.error('错误:', err.message);
  }
}

main();