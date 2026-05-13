const BASE = 'https://heartchain-backend.onrender.com/api/v1';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: text };
  }
}

async function get(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: text };
  }
}

async function main() {
  // 先注册一个测试用户 (开发模式验证码固定 123456)
  console.log('\n=== 1. 注册测试用户 ===');
  const reg = await post('/auth/register', {
    phone: '+821098765432',
    code: '123456',
    password: 'test123456',
    nickname: '测试用户',
    region: 'kr'
  });
  console.log(JSON.stringify(reg, null, 2));

  // 验证码登录
  console.log('\n=== 2. 验证码登录 ===');
  const codeLogin = await post('/auth/login', { phone: '+821098765432', code: '123456' });
  console.log(JSON.stringify(codeLogin, null, 2));

  // 密码登录
  console.log('\n=== 3. 密码登录 ===');
  const pwLogin = await post('/auth/password-login', { phone: '+821098765432', password: 'test123456' });
  console.log(JSON.stringify(pwLogin, null, 2));

  const token = codeLogin.data?.accessToken || pwLogin.data?.accessToken;
  if (!token) { console.log('登录失败，请检查'); return; }
  console.log('\n✅ 登录成功，token:', token.substring(0, 30) + '...');

  // === 登录后的任务列表和广告 ===
  const th = { 'Authorization': `Bearer ${token}` };
  console.log('\n=== 4. 任务列表（需认证） ===');
  const tasksAuth = await fetch(`${BASE}/tasks?page=1&limit=5`, { headers: th }).then(async r => { const t = await r.text(); try { return JSON.parse(t); } catch { return t; } });
  console.log(JSON.stringify(tasksAuth, null, 2));

  console.log('\n=== 5. 首页广告 ===');
  const ads = await get('/ad/project-ads/active?limit=3', token);
  console.log(JSON.stringify(ads, null, 2));

  // === 未登录用户 ===
  console.log('\n=== 5. 公开任务列表（正确参数） ===');
  const tasksPublic = await get('/tasks?page=1&limit=5');
  console.log(JSON.stringify(tasksPublic, null, 2));

  console.log('\n=== 6. 公开广告列表 ===');
  const adsPublic = await get('/ad/project-ads/active?limit=3');
  console.log(JSON.stringify(adsPublic, null, 2));

  // === 测试 password123 登录 ===
  console.log('\n=== 7. 密码登录 password123 ===');
  const correctPw = await post('/auth/password-login', { phone: '+821098765432', password: 'password123' });
  console.log(JSON.stringify(correctPw, null, 2));

  const token2 = correctPw.data?.accessToken;
  const th2 = token2 ? { 'Authorization': `Bearer ${token2}` } : {};
  console.log('token2:', token2 ? token2.substring(0, 30) + '...' : 'NONE');

  // === 管理员账号登录 ===
  console.log('\n=== 8. 管理员账号登录 (phone: +821022098999, pw: password123) ===');
  const adminLogin = await post('/auth/password-login', { phone: '+821022098999', password: 'password123' });
  console.log(JSON.stringify(adminLogin, null, 2));

  const adminToken = adminLogin.data?.accessToken;
  console.log('adminToken:', adminToken ? adminToken.substring(0, 30) + '...' : 'NONE');

  if (adminToken) {
    const thAdmin = { 'Authorization': `Bearer ${adminToken}` };
    console.log('\n=== 9. 管理员任务列表 ===');
    const adminTasks = await fetch(`${BASE}/admin/tasks?page=1&pageSize=5`, { headers: thAdmin }).then(async r => { const t = await r.text(); try { return JSON.parse(t); } catch { return t; } });
    console.log(JSON.stringify(adminTasks, null, 2));

    console.log('\n=== 10. 管理员仪表盘 ===');
    const dashboard = await fetch(`${BASE}/admin/dashboard`, { headers: thAdmin }).then(async r => { const t = await r.text(); try { return JSON.parse(t); } catch { return t; } });
    console.log(JSON.stringify(dashboard, null, 2));
  }

  // === 公开任务列表 (用正确参数) ===
  console.log('\n=== 11. 公开任务列表 (page=1&limit=5) ===');
  const pubTasks = await get('/tasks?page=1&limit=5');
  console.log(JSON.stringify(pubTasks, null, 2));
}

main().catch(console.error);
