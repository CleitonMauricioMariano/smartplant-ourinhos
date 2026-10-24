export interface GeminiDiagnosisResponse {
  diagnostico_ia: string;
  causa_raiz_provavel: string;
  prioridade_sugerida: 'baixa' | 'media' | 'alta' | 'critica';
  acao_recomendada: string[];
  estimativa_horas_ate_falha: number;
  fonte: 'gemini-3.8-flash' | 'local_cmrp_inference';
}

export async function requestGeminiDiagnosis(
  machineId: string,
  equipmentType: string,
  component: string,
  partCode: string,
  supplier: string,
  vibration: number,
  temperature: number,
  currentAmp: number,
  noiseDb: number
): Promise<GeminiDiagnosisResponse> {
  // Simulação / chamada inteligente com fallback robusto
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (apiKey) {
      const prompt = `Você é um Engenheiro Chefe de Manutenção Preditiva (CMRP). Analise:
Máquina: ${machineId} (${equipmentType})
Componente Crítico: ${component} [${partCode}]
Vibração RMS: ${vibration} mm/s | Temperatura: ${temperature}°C | Corrente: ${currentAmp}A | Ruído: ${noiseDb}dB.
Forneça diagnóstico técnico curto, causa raiz, prioridade (baixa/media/alta/critica) e 3 ações prescritivas.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            ...parsed,
            fonte: 'gemini-3.8-flash'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Gemini API offline ou demand spike, acionando motor CMRP local:', err);
  }

  // Fallback Determinístico Local CMRP (zero alucinações)
  const isCritical = vibration > 5.5 || temperature > 84;
  const isWarning = vibration > 3.8 || temperature > 80;

  const priority = isCritical ? 'critica' : isWarning ? 'alta' : 'media';
  const hoursToFail = isCritical ? 18 : isWarning ? 72 : 480;

  let causaRaiz = 'Assinatura harmônica estável em regime operacional nominal.';
  let diagnostico = `Equipamento ${machineId} operando em condições seguras. Manter periodicidade preventiva.`;
  let acoes = [
    'Manter rota de inspeção termográfica semanal padrão.',
    'Verificar níveis de graxa sintética do mancal.',
    'Acompanhar histórico de telemetria no próximo turno.'
  ];

  if (isCritical) {
    causaRaiz = `Fadiga superficial acelerada na pista interna do ${component}. Deslocamento axial com pico de ${vibration.toFixed(2)} mm/s e aquecimento a ${temperature.toFixed(1)}°C.`;
    diagnostico = `Degradação acelerada no rolamento/acoplamento de ${component}. Risco iminente de colapso mecânico sob carga plena.`;
    acoes = [
      `Executar bloqueio LOTO emergencial no quadro elétrico da linha.`,
      `Substituir imediatamente a peça ${partCode} (homologada ${supplier}).`,
      `Alinhar a laser os eixos motriz e movido com tolerância < 0.05mm.`
    ];
  } else if (isWarning) {
    causaRaiz = `Desalinhamento angular preliminar e folga em ${component}. Frequência de passagem de esferas com oscilação harmônica 2X.`;
    diagnostico = `Sobrecarga termodinâmica acima de 80°C. Necessário reaperto de flanges e purga de lubrificante degradado.`;
    acoes = [
      `Inspecionar dissipação térmica e limpar aletas da carcaça.`,
      `Coletar amostra de óleo para análise de contaminantes ferrosos.`,
      `Confirmar cotação em estoque da peça de reposição ${partCode}.`
    ];
  }

  return {
    diagnostico_ia: diagnostico,
    causa_raiz_provavel: causaRaiz,
    prioridade_sugerida: priority,
    acao_recomendada: acoes,
    estimativa_horas_ate_falha: hoursToFail,
    fonte: 'local_cmrp_inference'
  };
}
