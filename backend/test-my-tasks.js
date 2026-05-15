const API = 'http://localhost:3000/api/v1';

async function test() {
  // 登录
  const loginRes = await fetch(`${API}/auth/password-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+821022098999', password: 'asdf123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  console.log('登录成功:', loginData.user?.nickname);
  console.log('Token 前50字符:', token?.substring(0, 50));

  // 测试我发布的任务
  const myPublished = await fetch(`${API}/tasks/my/published`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const myPublishedData = await myPublished.json();
  console.log('\n=== 我发布的任务 ===');
  console.log('状态:', myPublished.status);
  console.log('数据:', JSON.stringify(myPublishedData, null, 2));

  // 测试我接的任务
  const myJoined = await fetch(`${API}/tasks/my/joined`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const myJoinedData = await myJoined.json();
  console.log('\n=== 我接的任务 ===');
  console.log('状态:', myJoined.status);
  console.log('数据:', JSON.stringify(myJoinedData, null, 2));

  // 测试所有任务
  const allTasks = await fetch(`${API}/tasks?status=open&limit=10`);
  const allTasksData = await allTasks.json();
  console.log('\n=== 所有任务大厅任务 ===');
  console.log('状态:', allTasks.status);
  console.log('任务数:', allTasksData.total);
}

test().catch(console.error);
