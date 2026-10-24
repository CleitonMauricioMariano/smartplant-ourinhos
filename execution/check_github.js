const https = require('https');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/github_personal_key\s*=\s*([^\r\n]+)/);
const token = match ? match[1].trim() : '';

const req = https.request({
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'User-Agent': 'Antigravity-Agent',
    'Authorization': `token ${token}`
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('USER:', parsed.login);
      console.log('NAME:', parsed.name);
      console.log('URL:', parsed.html_url);
    } catch (e) {
      console.log('RAW:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});
req.end();
