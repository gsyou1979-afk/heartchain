const http = require('http');

function httpRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('=== 获取任务列表 ===');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/tasks',
      method: 'GET',
    });
    
    console.log('状态:', res.status);
    console.log('响应类型:', res.headers['content-type']);
    console.log('响应长度:', res.body.length);
    console.log('响应内容:', res.body.substring(0, 500));
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
}

main();