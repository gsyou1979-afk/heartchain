const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/password-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': 57
  }
};

const req = http.request(options, (res) => {
  let result = '';
  res.on('data', chunk => result += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Body:', result.substring(0, 500));
  });
});

req.on('error', err => console.error('Error:', err));
req.write('{"phone":"+821098765432","password":"password123"}');
req.end();