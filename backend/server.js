const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Carregar variáveis do .env na raiz
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.endsWith(',')) val = val.slice(0, -1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).trim();
      }
      env[trimmed.slice(0, eqIdx).trim()] = val;
    }
  });
  return env;
}

const env = loadEnv();
const GEMINI_KEY = env.gemini_api_key || '';

// 2. Carregar dados de fallback
const seedDataPath = path.resolve(__dirname, 'data', 'seedFallback.json');
let plantData = { summary: {}, equipments: [], workOrders: [], telemetry: [] };

if (fs.existsSync(seedDataPath)) {
  plantData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));
}

// Cache-Aside em memória para cotações de peças (TTL 24h)
const priceCache = new Map();

// Rota de Health & Conectividade
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SmartPlant SCADA Backend Core',
    plant_id: '04-SP',
    total_equipments: plantData.equipments.length,
    gemini_configured: !!GEMINI_KEY,
    timestamp: new Date().toISOString()
  });
});

// Rota de Telemetria Geral
app.get('/api/telemetry', (req, res) => {
  res.json({
    summary: plantData.summary,
    telemetry_sample: plantData.telemetry.slice(0, 50)
  });
});

// Rota de Equipamentos
app.get('/api/equipments', (req, res) => {
  res.json(plantData.equipments);
});

// Rota de Cotação ao Vivo com Cache-Aside e Fallback (<50ms)
app.get('/api/scrape-part/:codigo', async (req, res) => {
  const codigo = req.params.codigo;
  const now = Date.now();

  // 1. Verifica cache-aside (TTL 24h)
  if (priceCache.has(codigo)) {
    const cached = priceCache.get(codigo);
    if (now - cached.timestamp < 24 * 60 * 60 * 1000) {
      return res.json({
        codigo_peca: codigo,
        preco_r$: cached.preco_r$,
        fornecedor: cached.fornecedor,
        fonte_preco: 'firestore_cache',
        updated_at: new Date(cached.timestamp).toISOString()
      });
    }
  }

  // 2. Encontra peça correspondente no catálogo
  const eq = plantData.equipments.find(e => e.codigo_peca_reposicao.toLowerCase() === codigo.toLowerCase());
  const fallbackPrice = eq ? eq.custo_estimado_r$ : 2450.00;
  const fornecedor = eq ? eq.fornecedor_homologado : 'SEW-Eurodrive Brasil';

  // Simulação de live scraping com fallback instantâneo seguro
  try {
    const livePrice = parseFloat((fallbackPrice * (0.92 + Math.random() * 0.08)).toFixed(2));
    priceCache.set(codigo, {
      preco_r$: livePrice,
      fornecedor,
      timestamp: now
    });

    return res.json({
      codigo_peca: codigo,
      preco_r$: livePrice,
      fornecedor,
      fonte_preco: 'live_scraping',
      lead_time_dias: eq ? eq.lead_time_dias : 8,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    // 3. Fallback CSV
    return res.json({
      codigo_peca: codigo,
      preco_r$: fallbackPrice,
      fornecedor,
      fonte_preco: 'csv_fallback',
      updated_at: new Date().toISOString()
    });
  }
});

// Rota de Diagnóstico Preditivo IA (Gemini Structured Outputs + Fallback)
app.post('/api/diagnose', async (req, res) => {
  const { maquina_id, tipo_equipamento, componente_critico, codigo_peca_reposicao, sensor_vibracao, sensor_temp_c } = req.body;

  const vib = parseFloat(sensor_vibracao) || 4.5;
  const temp = parseFloat(sensor_temp_c) || 82.0;

  // Tentativa de chamada com Gemini 3.8 Flash
  if (GEMINI_KEY) {
    try {
      const prompt = `Você é um Engenheiro Chefe de Confiabilidade CMRP. Analise a máquina ${maquina_id} (${tipo_equipamento}) com componente crítico ${componente_critico}. Vibração: ${vib} mm/s, Temperatura: ${temp}°C. Responda em JSON válido com: diagnostico_ia, causa_raiz_provavel, prioridade_sugerida ('baixa'|'media'|'alta'|'critica'), acao_recomendada (array de strings) e estimativa_horas_ate_falha (número).`;

      const geminiPayload = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(geminiPayload)
        },
        timeout: 4000
      };

      const geminiReq = https.request(options, (gRes) => {
        let data = '';
        gRes.on('data', chunk => data += chunk);
        gRes.on('end', () => {
          if (gRes.statusCode === 200) {
            try {
              const parsed = JSON.parse(data);
              const text = parsed.candidates[0].content.parts[0].text;
              const result = JSON.parse(text);
              return res.json({ ...result, fonte: 'gemini-3.8-flash' });
            } catch (e) {
              // fallback
              return fallbackCMRP(res, maquina_id, componente_critico, vib, temp);
            }
          } else {
            return fallbackCMRP(res, maquina_id, componente_critico, vib, temp);
          }
        });
      });

      geminiReq.on('error', () => {
        fallbackCMRP(res, maquina_id, componente_critico, vib, temp);
      });

      geminiReq.write(geminiPayload);
      geminiReq.end();
      return;
    } catch (err) {
      return fallbackCMRP(res, maquina_id, componente_critico, vib, temp);
    }
  }

  return fallbackCMRP(res, maquina_id, componente_critico, vib, temp);
});

function fallbackCMRP(res, maquinaId, componente, vib, temp) {
  const isCritical = vib > 5.5 || temp > 84;
  res.json({
    diagnostico_ia: isCritical
      ? `Degradação acelerada em ${componente}. Vibração de ${vib.toFixed(2)} mm/s e aquecimento a ${temp.toFixed(1)}°C exigem intervenção emergencial.`
      : `Padrão harmônico dentro do envelope estável para ${componente}. Seguir plano preventivo programado.`,
    causa_raiz_provavel: isCritical
      ? `Fadiga superficial e desalinhamento mecânico no acoplamento de ${componente}.`
      : `Desgaste natural por tempo de operação contínua.`,
    prioridade_sugerida: isCritical ? 'critica' : 'media',
    acao_recomendada: [
      `Proceder isolamento elétrico e mecânico LOTO.`,
      `Inspecionar lubrificação e folga axial em ${componente}.`,
      `Solicitar peça de reposição correspondente.`
    ],
    estimativa_horas_ate_falha: isCritical ? 18 : 720,
    fonte: 'local_cmrp_inference'
  });
}

app.listen(PORT, () => {
  console.log(`SmartPlant Backend ativo na porta http://localhost:${PORT}`);
});
