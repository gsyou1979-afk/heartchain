const http = require('http');

const data = JSON.stringify({
  phone: '+821098765432',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/v1/auth/password-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    console.log('Body:', body);
  });
});

req.on('error', e => console.error('Error:', e.message));
req.write(data);
req.end();
