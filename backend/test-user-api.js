const http = require('http');

const API_BASE = 'http://localhost:3000/api/v1';

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
  // 1. 登录用户账号
  const login = await request('POST', '/auth/password-login', { 
    phone: '+821022098999', 
    password: 'password123' 
  });
  
  if (login.status !== 200) {
    console.log('登录失败:', login.body);
    return;
  }
  
  const token = login.body.accessToken;
  const userId = login.body.user.id;
  console.log('✅ 登录成功');
  console.log('   用户ID:', userId);
  
  // 2. 测试更新学历
  const education = [
    { level: 'bachelor', school: '한국대학교', year: '2020' },
    { level: 'master', school: '서울대학교', year: '2022' }
  ];
  
  const update = await request('PUT', '/users/me', {
    education: education
  }, token);
  
  console.log('\n📝 更新学历:');
  console.log('   状态:', update.status);
  console.log('   响应:', JSON.stringify(update.body, null, 2));
  
  // 3. 获取用户信息验证
  const user = await request('GET', '/users/me', null, token);
  console.log('\n👤 获取用户信息:');
  console.log('   状态:', user.status);
  console.log('   学历:', JSON.stringify(user.body.education));
  
}

main().catch(console.error);