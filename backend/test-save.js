const http = require('http');

async function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${token}`
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
    req.write(body);
    req.end();
  });
}

async function main() {
  // 1. 登录
  const login = await request('POST', '/auth/password-login', { 
    phone: '+821022098999', 
    password: 'asdf123' 
  });
  
  if (login.status !== 200) {
    console.log('❌ 登录失败');
    return;
  }
  
  const token = login.body.accessToken;
  console.log('✅ 登录成功');
  
  // 2. 添加学历
  const edu = [
    { level: 'bachelor', school: '한국대학교', year: '2020' },
    { level: 'master', school: '서울대학교', year: '2022' }
  ];
  
  const update = await request('PUT', '/users/me', {
    education: edu,
    nickname: 'TestUser'
  }, token);
  
  console.log('\n📝 更新学历:');
  console.log('   状态:', update.status);
  
  if (update.status === 200) {
    console.log('   学历:', JSON.stringify(update.body.education));
  } else {
    console.log('   错误:', JSON.stringify(update.body));
  }
}

main().catch(console.error);