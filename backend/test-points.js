const http = require('http');

// 1. 先登录获取token
const loginData = JSON.stringify({
  phone: '+821098765432',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/password-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', async () => {
    const loginResult = JSON.parse(body);
    if (!loginResult.accessToken) {
      console.log('❌ 登录失败:', body);
      return;
    }
    console.log('✅ 登录成功!');
    const token = loginResult.accessToken;

    // 2. 获取积分规则
    console.log('\n--- 获取积分规则 ---');
    const getRules = await fetch('http://localhost:3000/api/v1/admin/points/rules', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('GET Status:', getRules.status);
    const rules = await getRules.json();
    console.log('积分规则:', JSON.stringify(rules, null, 2));

    // 3. 更新积分规则
    console.log('\n--- 更新积分规则 ---');
    const updateData = JSON.stringify({
      hourlyRate: 15,
      laborTypes: [
        { type: '技术开发', multiplier: 1.5 }
      ]
    });
    
    const updateOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/admin/points/rules',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updateData),
        'Authorization': `Bearer ${token}`
      }
    };

    const updateReq = http.request(updateOptions, (updateRes) => {
      let updateBody = '';
      updateRes.on('data', (chunk) => updateBody += chunk);
      updateRes.on('end', () => {
        console.log('PUT Status:', updateRes.statusCode);
        console.log('响应:', updateBody);
      });
    });
    updateReq.write(updateData);
    updateReq.end();
  });
});

loginReq.on('error', (e) => console.log('Error:', e.message));
loginReq.write(loginData);
loginReq.end();