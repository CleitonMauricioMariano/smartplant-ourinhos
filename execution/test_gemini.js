const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  });
  return env;
}

const env = loadEnv();
const key = env.gemini_api_key;
console.log('Testando Gemini API Key (tamanho:', key ? key.length : 0, ')...');

const payload = JSON.stringify({
  contents: [{
    parts: [{ text: "Responda apenas: 'ONLINE'" }]
  }]
});

const req = https.request({
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-3.8-flash:generateContent?key=${key}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('✅ Gemini API ONLINE!');
    } else {
      console.log('Resposta Gemini:', body.slice(0, 300));
    }
  });
});

req.on('error', (e) => {
  console.log('Erro de rede Gemini:', e.message);
});

req.write(payload);
req.end();
