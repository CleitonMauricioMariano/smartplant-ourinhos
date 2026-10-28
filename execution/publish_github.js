const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Carregar token do .env ou variável de ambiente
const envPath = path.resolve(__dirname, '..', '.env');
let token = process.env.GITHUB_TOKEN || '';

if (!token && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/(?:github_personal_key|GITHUB_TOKEN)\s*=\s*([^\r\n]+)/i);
  if (match) {
    token = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

if (!token) {
  console.error('❌ Token do GitHub (github_personal_key) não encontrado em .env');
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
        let parsed = null;
        try {
          parsed = body ? JSON.parse(body) : null;
        } catch (e) {
          parsed = body;
        }
        resolve({ status: res.statusCode, data: body, json: parsed });
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

// Atualiza um arquivo individual via GitHub Contents API (sem depender de git instalado)
async function upsertFileViaApi(repoPath, localFilePath, commitMessage) {
  const contentBase64 = fs.readFileSync(localFilePath).toString('base64');
  const getRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/contents/${repoPath}`, 'GET');

  const payload = {
    message: commitMessage,
    content: contentBase64,
    branch: 'main'
  };

  if (getRes.status === 200 && getRes.json && getRes.json.sha) {
    payload.sha = getRes.json.sha;
  }

  const putRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/contents/${repoPath}`, 'PUT', payload);
  if (putRes.status === 200 || putRes.status === 201) {
    console.log(`✅ Arquivo sincronizado no GitHub: ${repoPath}`);
  } else {
    throw new Error(`Falha ao enviar ${repoPath} (HTTP ${putRes.status}): ${putRes.data}`);
  }
}

async function publishViaGitDataApi(rootDir, filesToSync, commitMessage) {
  console.log('Sincronizando arquivos via GitHub Git Data API (commit atômico)...');

  // 1. Obter referência atual da branch main
  const refRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/git/ref/heads/main`, 'GET');
  if (refRes.status !== 200 || !refRes.json?.object?.sha) {
    // Fallback para Contents API arquivo por arquivo
    for (const relPath of filesToSync) {
      const fullPath = path.join(rootDir, relPath);
      if (fs.existsSync(fullPath)) {
        await upsertFileViaApi(relPath.replace(/\\/g, '/'), fullPath, commitMessage);
      }
    }
    return;
  }

  const latestCommitSha = refRes.json.object.sha;

  // 2. Obter o commit atual para pegar o base_tree
  const commitRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/git/commits/${latestCommitSha}`, 'GET');
  const baseTreeSha = commitRes.json.tree.sha;

  // 3. Criar entradas da árvore para os arquivos atualizados
  const treeItems = [];
  for (const relPath of filesToSync) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      treeItems.push({
        path: relPath.replace(/\\/g, '/'),
        mode: '100644',
        type: 'blob',
        content
      });
    }
  }

  const newTreeRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/git/trees`, 'POST', {
    base_tree: baseTreeSha,
    tree: treeItems
  });

  if (newTreeRes.status !== 201) {
    throw new Error(`Erro ao criar árvore Git: ${newTreeRes.data}`);
  }

  // 4. Criar novo commit
  const newCommitRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/git/commits`, 'POST', {
    message: commitMessage,
    tree: newTreeRes.json.sha,
    parents: [latestCommitSha]
  });

  if (newCommitRes.status !== 201) {
    throw new Error(`Erro ao criar commit Git: ${newCommitRes.data}`);
  }

  // 5. Atualizar referência heads/main
  const updateRefRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}/git/refs/heads/main`, 'PATCH', {
    sha: newCommitRes.json.sha,
    force: true
  });

  if (updateRefRes.status !== 200) {
    throw new Error(`Erro ao atualizar branch main: ${updateRefRes.data}`);
  }

  console.log(`✅ Commit ${newCommitRes.json.sha.slice(0, 7)} publicado na branch main!`);
}

async function main() {
  try {
    // 1. Verificar se repositório existe
    console.log(`Verificando repositório ${REPO_NAME}...`);
    const checkRes = await githubRequest(`/repos/${USERNAME}/${REPO_NAME}`, 'GET');

    if (checkRes.status === 200) {
      console.log(`✅ Repositório ${REPO_NAME} localizado.`);
    } else if (checkRes.status === 404) {
      console.log(`Criando repositório ${REPO_NAME} no GitHub...`);
      await githubRequest('/user/repos', 'POST', {
        name: REPO_NAME,
        description: 'SmartPlant Ourinhos — Industrial IoT SCADA 4.0 Telemetry & Predictive Maintenance System | Google Antigravity & Gemini 3.8 Flash',
        private: false
      });
    } else if (checkRes.status === 401) {
      throw new Error('Token do GitHub inválido ou expirado (HTTP 401).');
    }

    const rootDir = path.resolve(__dirname, '..');
    const commitMsg = 'fix(vercel): add Vite ImportMetaEnv types (vite-env.d.ts) and vercel.json for clean TypeScript build';

    // Verificar se git CLI está disponível
    let hasGitCli = false;
    try {
      execSync('git --version', { stdio: 'ignore' });
      hasGitCli = true;
    } catch {
      hasGitCli = false;
    }

    if (hasGitCli && fs.existsSync(path.join(rootDir, '.git'))) {
      const run = (cmd) => {
        console.log(`> ${cmd}`);
        return execSync(cmd, { cwd: rootDir, encoding: 'utf-8', stdio: 'inherit' });
      };
      const remoteUrl = `https://${token}@github.com/${USERNAME}/${REPO_NAME}.git`;
      try { run('git remote remove origin'); } catch {}
      run(`git remote add origin ${remoteUrl}`);
      run('git add .');
      try {
        run(`git commit -m "${commitMsg}"`);
      } catch {
        console.log('Nada novo para commitar localmente.');
      }
      run('git push -u origin main --force');
    } else {
      // Publicação direta via API HTTPS do GitHub (não requer git instalado na máquina)
      const filesToSync = [
        'frontend/src/vite-env.d.ts',
        'frontend/tsconfig.json',
        'frontend/vercel.json',
        'frontend/src/services/geminiService.ts',
        'execution/publish_github.js',
        'documentation/promptHistory.md'
      ];
      await publishViaGitDataApi(rootDir, filesToSync, commitMsg);
    }

    console.log('\n============================================================');
    console.log(`🎉 PROJETO ATUALIZADO COM SUCESSO NO GITHUB!`);
    console.log(`URL do Repositório: https://github.com/${USERNAME}/${REPO_NAME}`);
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Erro na publicação:', error.message);
    process.exit(1);
  }
}

main();
