const http = require('http');

const data = JSON.stringify({
  phone: '+821098765432',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/password-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const d = JSON.parse(body);
    if (d.accessToken) {
      console.log('✅ 登录成功!');
      console.log('Token:', d.accessToken.substring(0, 50) + '...');
      console.log('用户:', d.user);
    } else {
      console.log('❌ 登录失败:', d.statusCode, d.message);
    }
  });
});

req.on('error', (e) => console.log('Error:', e.message));
req.write(data);
req.end();
