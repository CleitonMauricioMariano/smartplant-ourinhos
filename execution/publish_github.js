const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Carregar token do .env
const envPath = path.resolve(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/github_personal_key\s*=\s*([^\r\n]+)/);
const token = match ? match[1].trim() : '';

if (!token) {
  console.error('❌ Token do GitHub não encontrado em .env');
  process.exit(1);
}

const REPO_NAME = 'smartplant-ourinhos';
const USERNAME = 'CleitonMauricioMariano';

console.log(`Iniciando publicação no GitHub para o usuário: ${USERNAME}...`);
console.log(`Nome do repositório alvo: ${REPO_NAME}`);

// Função para requisições HTTPS à API do GitHub
function githubRequest(endpoint, method, payload = null) {
  return new Promise((resolve, reject) => {
    const dataString = payload ? JSON.stringify(payload) : null;
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'User-Agent': 'Antigravity-Agent',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    if (dataString) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: body });
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function main() {
  try {
    // 1. Verificar se repositório existe ou criar
    console.log(`Verificando se repositório ${REPO_NAME} já existe...`);
    const checkRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}`, 'GET');
    
    if (checkRes.status === 200) {
      console.log(`✅ Repositório ${REPO_NAME} já existe.`);
    } else if (checkRes.status === 404) {
      console.log(`Criando repositório ${REPO_NAME} no GitHub...`);
      const createRes = await githubRequest('/user/repos', 'POST', {
        name: REPO_NAME,
        description: 'SmartPlant Ourinhos — Industrial IoT SCADA 4.0 Telemetry & Predictive Maintenance System | Google Antigravity & Gemini 3.8 Flash',
        private: false,
        has_issues: true,
        has_projects: true,
        has_wiki: true
      });
      console.log('Status de criação:', createRes.status);
      if (createRes.status === 201) {
        console.log(`✅ Repositório ${REPO_NAME} criado com sucesso!`);
      } else {
        console.warn('Resposta da criação:', createRes.data);
      }
    } else {
      console.log('Status da verificação:', checkRes.status, checkRes.data);
    }

    // 2. Comandos Git Locais
    const rootDir = path.resolve(__dirname, '..');
    const run = (cmd) => {
      console.log(`> ${cmd}`);
      return execSync(cmd, { cwd: rootDir, encoding: 'utf-8', stdio: 'inherit' });
    };

    // Configurar autor se não configurado
    try {
      execSync('git config user.name', { cwd: rootDir });
    } catch {
      run(`git config user.name "${USERNAME}"`);
      run(`git config user.email "${USERNAME}@users.noreply.github.com"`);
    }

    // Inicializar git se necessário
    if (!fs.existsSync(path.join(rootDir, '.git'))) {
      run('git init');
      run('git branch -M main');
    }

    // Configurar remote seguro com token
    const remoteUrl = `https://${token}@github.com/${USERNAME}/${REPO_NAME}.git`;
    try {
      run('git remote remove origin');
    } catch (e) {
      // Remote pode não existir ainda
    }
    run(`git remote add origin ${remoteUrl}`);

    // Adicionar arquivos respeitando .gitignore
    run('git add .');

    // Commit
    try {
      run('git commit -m "feat: SmartPlant Ourinhos SCADA 4.0 industrial system orchestrated by Google Antigravity"');
    } catch (e) {
      console.log('Nada para commitar ou já commitado.');
    }

    // Push para a branch main
    console.log('Enviando código para o GitHub (branch main)...');
    run('git push -u origin main --force');

    console.log('\n============================================================');
    console.log(`🎉 PROJETO PUBLICADO COM SUCESSO NO GITHUB!`);
    console.log(`URL do Repositório: https://github.com/${USERNAME}/${REPO_NAME}`);
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Erro na publicação:', error.message);
    process.exit(1);
  }
}

main();
