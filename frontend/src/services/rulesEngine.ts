import { OperationalStatus } from '../types/smartplant';

export interface EvaluatedHealth {
  status: OperationalStatus;
  riscoParadaPercent: number;
  compraAntecipada: boolean;
  mensagem: string;
}

/**
 * Motor de Regras Determinísticas da Planta Industrial (SOP Camada 2)
 */
export function evaluateMachineHealth(
  inboardVib: number,
  outboardVib: number,
  tempC: number,
  leadTimeDias: number
): EvaluatedHealth {
  const vibracaoMax = Math.max(inboardVib, outboardVib);
  const compraAntecipada = leadTimeDias > 5;

  // Regra 1: Risco Crítico
  if (vibracaoMax > 6.0 || (vibracaoMax > 5.0 && tempC > 82) || tempC > 90) {
    return {
      status: 'Risco Crítico de Falha',
      riscoParadaPercent: Math.min(99, Math.round(85 + (vibracaoMax - 6.0) * 4 + (tempC - 80) * 0.5)),
      compraAntecipada,
      mensagem: `Pico crítico detectado: Vibração máx em ${vibracaoMax.toFixed(2)} mm/s e Temperatura em ${tempC.toFixed(1)}°C. Risco iminente de travamento.`
    };
  }

  // Regra 2: Sobrecarga Térmica
  if (tempC > 80) {
    return {
      status: 'Atenção - Temperatura',
      riscoParadaPercent: Math.min(84, Math.round(60 + (tempC - 80) * 2.2)),
      compraAntecipada,
      mensagem: `Alerta térmico: Temperatura de carcaça em ${tempC.toFixed(1)}°C acima do threshold permissível de 80°C.`
    };
  }

  // Regra 3: Alerta de Vibração / Harmônicas
  if (vibracaoMax > 3.8) {
    return {
      status: 'Alerta de Vibração',
      riscoParadaPercent: Math.min(75, Math.round(45 + (vibracaoMax - 3.8) * 12)),
      compraAntecipada,
      mensagem: `Deriva vibracional: Harmônicas em ${vibracaoMax.toFixed(2)} mm/s superando a linha de base de 3.8 mm/s.`
    };
  }

  // Nominal
  return {
    status: 'Operando Normal',
    riscoParadaPercent: Math.max(2, Math.round(vibracaoMax * 4 + (tempC / 20))),
    compraAntecipada,
    mensagem: 'Parâmetros cinemáticos estáveis dentro do envelope de operação segura.'
  };
}
