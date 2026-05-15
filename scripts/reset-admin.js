const http = require('http');

// 管理员 MD5 hash
const adminHash = 'a960e75da80032b2527dc58c28c4568c'; // Admin@2026
const testHash = '482c811da5d5aabb6d2504cde0f8b006'; // password123

async function api(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(body && { 'Content-Length': Buffer.byteLength(body) }),
        ...(token && { 'Authorization': 'Bearer ' + token }),
      }
    };
    const req = http.request(options, (res) => {
      let result = '';
      res.on('data', c => result += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(result) }); }
        catch { resolve({ status: res.statusCode, data: result }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  console.log('=== HeartChain 密码重置工具 ===\n');

  // 1. 用手机号登录获取token (如果有账号的话)
  // 先尝试用管理员手机号登录
  console.log('1. 尝试获取管理员token...');
  try {
    const loginRes = await api('POST', '/auth/phone-login', { phone: '+821022098999' });
    if (loginRes.status === 200 || loginRes.status === 201) {
      const adminToken = loginRes.data.accessToken;
      console.log('   获取token成功!\n');

      // 2. 重置管理员密码
      console.log('2. 重置管理员密码为 Admin@2026...');
      const resetRes = await api('PUT', '/admin/users/password', {
        userId: null,
        phone: '+821022098999',
        field: 'password',
        value: adminHash
      }, adminToken);
      console.log('   状态:', resetRes.status);
      console.log('   结果:', JSON.stringify(resetRes.data));
      console.log('');
    }
  } catch (e) {
    console.log('   登录失败，需要先注册管理员账号\n');
  }

  // 3. 尝试注册管理员账号 (如果不存在)
  console.log('3. 尝试注册管理员账号...');
  try {
    const regRes = await api('POST', '/auth/register', {
      phone: '+821022098999',
      password: 'Admin@2026',
      nickname: '管理员',
      code: '123456'  // 开发模式验证码
    });
    console.log('   状态:', regRes.status);
    console.log('   结果:', JSON.stringify(regRes.data));
  } catch (e) {
    console.log('   注册失败:', e.message);
  }

  console.log('\n=== 完成 ===');
  console.log('管理员账号: +821022098999');
  console.log('密码: Admin@2026');
}

main().catch(console.error);
