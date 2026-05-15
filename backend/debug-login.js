// 测试登录API
const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : undefined;
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: body ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      } : {}
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', d => responseData += d);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(responseData)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function test() {
  console.log('=== 测试登录API ===\n');

  // 1. 测试健康检查
  console.log('1. 健康检查...');
  try {
    const health = await makeRequest('GET', '/api/v1');
    console.log('   Status:', health.status);
    console.log('   Response:', JSON.stringify(health.data).substring(0, 100));
  } catch (e) {
    console.log('   错误:', e.message);
  }

  // 2. 测试密码登录
  console.log('\n2. 测试密码登录...');
  console.log('   手机号: +821098765432');
  console.log('   密码: password123');

  try {
    const login = await makeRequest('POST', '/api/v1/auth/password-login', {
      phone: '+821098765432',
      password: 'password123'
    });
    console.log('   Status:', login.status);
    console.log('   Response:', JSON.stringify(login.data));
  } catch (e) {
    console.log('   错误:', e.message);
  }

  // 3. 测试任务列表
  console.log('\n3. 测试任务列表...');
  try {
    const tasks = await makeRequest('GET', '/api/v1/tasks?status=open&limit=3');
    console.log('   Status:', tasks.status);
    if (tasks.data.items) {
      console.log('   任务数:', tasks.data.items.length);
    }
  } catch (e) {
    console.log('   错误:', e.message);
  }
}

test().catch(console.error);
