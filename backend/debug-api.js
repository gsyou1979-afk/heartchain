const http = require('http');

const API_BASE = 'http://localhost:3000/api/v1';

// 测试登录
function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const [host, port] = ['localhost', '3000'];
    
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // 1. 先获取所有技能（通过获取用户列表）
  console.log('1. 测试获取技能列表...');
  
  // 2. 创建测试用户
  console.log('\n2. 注册测试用户...');
  const regResult = await post(`${API_BASE}/auth/register`, {
    phone: '+821098765432',
    code: '123456',
    password: 'password123',
    nickname: 'no1'
  });
  console.log('注册结果:', regResult.status, JSON.stringify(regResult.data, null, 2).substring(0, 200));
  
  if (regResult.status !== 201 && regResult.status !== 200) {
    console.log('\n尝试登录...');
    const loginResult = await post(`${API_BASE}/auth/password-login`, {
      phone: '+821098765432',
      password: 'password123'
    });
    console.log('登录结果:', loginResult.status, JSON.stringify(loginResult.data, null, 2).substring(0, 300));
    
    if (loginResult.data.token) {
      console.log('\n3. 发布任务测试...');
      // 使用 token 创建任务
      const taskRes = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginResult.data.token}`
        },
        body: JSON.stringify({
          title: '测试任务-debug',
          taskType: 'single_once',
          requiredSkills: ['tech', 'design'],
          description: '测试任务描述',
          pointsReward: 60
        })
      });
      const taskData = await taskRes.json();
      console.log('发布任务结果:', taskRes.status, JSON.stringify(taskData, null, 2).substring(0, 500));
    }
  }
}

main().catch(console.error);
