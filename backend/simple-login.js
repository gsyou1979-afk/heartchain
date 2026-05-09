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
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let result = '';
  res.on('data', chunk => result += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', result.substring(0, 1000));
  });
});

req.on('error', err => console.error('Error:', err));
req.write(data);
req.end();
