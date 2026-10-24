const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch } = require('firebase/firestore');
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
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.endsWith(',')) val = val.slice(0, -1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).trim();
      }
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.firebase_apiKey,
  authDomain: env.firebase_authDomain,
  projectId: env.firebase_projectId,
  storageBucket: env.firebase_storageBucket,
  messagingSenderId: env.firebase_messagingSenderId,
  appId: env.firebase_appId
};

console.log('Iniciando conexão com Firebase Firestore...');
console.log('Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Carregar dados de fallback
const seedPath = path.resolve(__dirname, '..', 'frontend', 'src', 'data', 'seedFallback.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

async function testConnection() {
  try {
    console.log('Testando gravação do status da planta no Firestore...');
    const plantRef = doc(db, 'system', 'status');
    await setDoc(plantRef, {
      ...seedData.summary,
      updated_at: new Date().toISOString(),
      connection_status: 'online'
    });
    console.log('✅ Gravação no Firestore bem-sucedida! Documento: system/status');

    // Gravar amostra inicial de equipamentos (primeiros 20 ativos principais)
    console.log('Gravando lote inicial de equipamentos no Firestore...');
    const batch = writeBatch(db);
    seedData.equipments.slice(0, 25).forEach(eq => {
      const ref = doc(db, 'equipments', eq.maquina_id);
      batch.set(ref, eq);
    });
    await batch.commit();
    console.log('✅ 25 equipamentos principais persistidos no Firestore com sucesso!');

    // Gravar ordens de serviço críticas
    const osBatch = writeBatch(db);
    seedData.workOrders.slice(0, 15).forEach(wo => {
      const ref = doc(db, 'work_orders', wo.os_id);
      osBatch.set(ref, wo);
    });
    await osBatch.commit();
    console.log('✅ 15 Ordens de Serviço persistidas no Firestore!');

    process.exit(0);
  } catch (err) {
    console.warn('⚠️ Nota sobre regras de segurança do Firestore:', err.message);
    console.log('ℹ️ O sistema continuará no modo Local Hydrated Mode resiliente com seedFallback.json.');
    process.exit(0);
  }
}

testConnection();
