const http = require('http');

const hash = '4988dd6405a5d97a47a2a74bf81fd357';

const data = JSON.stringify({
  userId: null, // We'll search by phone
  phone: '+821098765432',
  field: 'password',
  value: hash
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/admin/users/password',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMxMjMxMi0xMjMxLTIzNDUtNjM0NS02Nzg5MTIzNDU2Nzg5IiwicGhvbmUiOiIrODIxMDk4NzY1NDMyIiwiaWF0IjoxNzEzMzI3ODAwLCJleHAiOjE3MTM5MzI2MDB9.XfpR3G2yqdJ0zJqIqJ3xQ5mKqzG9F0J2dM0o3P1b9qA'
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.log('Error:', e.message));
req.write(data);
req.end();
