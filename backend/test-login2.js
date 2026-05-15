const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1${path}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    // 测试登录
    console.log('1. 测试登录...');
    const loginRes = await post('/auth/password-login', {
      phone: '+821098765432',
      password: 'password123'  // 默认密码
    });
    console.log('状态:', loginRes.status);
    console.log('响应:', JSON.stringify(loginRes.body, null, 2));

    if (loginRes.body.accessToken) {
      console.log('\n✅ 登录成功!');
      console.log('Access Token:', loginRes.body.accessToken.substring(0, 50) + '...');
    } else {
      console.log('\n❌ 登录失败:', loginRes.body.message);
    }

  } catch (err) {
    console.error('错误:', err.message);
  }
}

main();
