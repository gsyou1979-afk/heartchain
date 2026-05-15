const http = require('http');

const API_BASE = 'http://localhost:3000';

// 通用POST请求
function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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

// 通用GET请求
function get(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
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
    req.end();
  });
}

// 通用PUT请求
function put(path, data, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${token}`
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
  console.log('========== 完整流程测试 ==========\n');
  
  // 1. 登录
  console.log('1️⃣ 登录...');
  const loginRes = await post('/auth/password-login', {
    phone: '+821098765432',
    password: 'password123'
  });
  console.log('   状态:', loginRes.status);
  
  if (!loginRes.data.accessToken) {
    console.log('   ❌ 登录失败');
    return;
  }
  
  const token = loginRes.data.accessToken;
  console.log('   ✅ 登录成功\n');

  // 2. 更新用户技能
  console.log('2️⃣ 更新用户技能为 [tech, design, driving]...');
  const updateRes = await put('/users/me', {
    nickname: 'no1',
    skills: ['tech', 'design', 'driving']
  }, token);
  console.log('   状态:', updateRes.status);
  console.log('   用户技能:', updateRes.data.skills);
  console.log('   ✅ 技能更新成功\n');

  // 3. 获取最新用户信息
  console.log('3️⃣ 获取最新用户信息...');
  const userRes = await get('/users/me', token);
  console.log('   状态:', userRes.status);
  console.log('   昵称:', userRes.data.nickname);
  console.log('   技能:', userRes.data.skills);
  console.log('   ✅ 获取成功\n');

  // 4. 发布任务
  console.log('4️⃣ 发布任务（使用用户技能作为所需技能）...');
  const taskRes = await post('/tasks', {
    title: '完整流程测试任务',
    taskType: 'single_once',
    requiredSkills: userRes.data.skills,  // 使用用户的技能
    description: '测试完整发布流程，包括技能关联',
    pointsReward: 85
  }, token);
  console.log('   状态:', taskRes.status);
  console.log('   任务ID:', taskRes.data.id);
  console.log('   所需技能:', taskRes.data.requiredSkills);
  
  if (taskRes.status === 201) {
    console.log('   ✅ 任务发布成功\n');
  } else {
    console.log('   ❌ 任务发布失败:', taskRes.data.message);
  }

  // 5. 获取任务列表验证
  console.log('5️⃣ 获取任务列表验证...');
  const listRes = await get('/tasks', token);
  console.log('   状态:', listRes.status);
  console.log('   任务总数:', Array.isArray(listRes.data) ? listRes.data.length : 'N/A');
  
  const testTask = Array.isArray(listRes.data) ? listRes.data.find(t => t.id === taskRes.data.id) : null;
  if (testTask) {
    console.log('   ✅ 任务已添加到列表');
    console.log('      - 标题:', testTask.title);
    console.log('      - 技能:', testTask.requiredSkills);
    console.log('      - 发布者:', testTask.publisherId);
  }

  console.log('\n========== 测试完成 ==========');
}

main().catch(console.error);