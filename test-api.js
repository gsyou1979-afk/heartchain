const http = require('http');

const data = JSON.stringify({
  code: 'A1',
  name: '顶部横幅',
  location: 'homepage-top',
  imageUrl: '',
  targetUrl: ''
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/v1/ad/placements',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body.substring(0, 200));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
