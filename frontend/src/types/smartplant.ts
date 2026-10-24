export type ProductionLine =
  | 'Linha A - Envasamento'
  | 'Linha B - Rotulagem'
  | 'Linha C - Embalagem'
  | 'Linha D - Processamento Térmico'
  | 'Linha E - Utilidades e Caldeira';

export type ShiftType = 'Manhã (06h-14h)' | 'Tarde (14h-22h)' | 'Noite (22h-06h)';

export type OperationalStatus =
  | 'Operando Normal'
  | 'Alerta de Vibração'
  | 'Atenção - Temperatura'
  | 'Risco Crítico de Falha';

// Coleção / Entidade: Equipment
export interface Equipment {
  maquina_id: string;              // PK: ex: "EQP-0215"
  tipo_equipamento: string;        // ex: "Paletizador Robótico ABB"
  linha_producao: ProductionLine | string;
  componente_critico: string;      // ex: "Redutor Planetário SEW-Eurodrive"
  codigo_peca_reposicao: string;   // ex: "SEW-R47-AD2"
  fornecedor_homologado: string;   // ex: "SEW-Eurodrive Brasil"
  custo_estimado_r$: number;
  lead_time_dias: number;
  compra_antecipada_flag: boolean; // lead_time_dias > 5
  mtbf_horas: number;
  mttr_horas: number;
  horas_uso?: number;
  status_atual: OperationalStatus;
  risco_parada_percent: number;    // 0 a 100
  eficiencia_oee_percent?: number;
  temp_atual?: number;
  vibracao_atual?: number;
  diagnostico_recente?: string;
  updated_at: string;              // ISO8601
}

// Coleção / Entidade: TelemetryRecord (Time-Series)
export interface TelemetryRecord {
  registro_id: string;
  timestamp: string;               // ISO8601 ou YYYY-MM-DD HH:mm
  turno: ShiftType | string;
  maquina_id: string;              // FK -> equipments.maquina_id
  sensor_temp_c: number;
  sensor_vibracao_inboard_mm_s: number;
  sensor_vibracao_outboard_mm_s: number;
  pressao_psi: number;
  corrente_eletrica_amp: number;
  nivel_ruido_db: number;
  status_operacional: OperationalStatus;
  risco_parada_percent: number;    // 0 a 100
  oee_availability_percent: number;
  oee_performance_percent: number;
  oee_quality_percent: number;
  eficiencia_oee_percent: number;  // (Avail * Perf * Qual) / 10000
}

// Coleção / Entidade: WorkOrder
export interface WorkOrder {
  os_id: string;                   // ex: "OS-2026-0891"
  maquina_id: string;
  tipo: 'preventiva' | 'corretiva' | 'preditiva';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  componente: string;
  peca_codigo: string;
  custo_estimado_csv: number;
  preco_cotado_atual: number | null;
  fornecedor_cotado: string;
  fonte_preco: 'live_scraping' | 'firestore_cache' | 'csv_fallback';
  lead_time_dias: number;
  compra_antecipada: boolean;
  diagnostico_ia: string;
  acao_recomendada: string[];
  status: 'aberta' | 'em_andamento' | 'concluida';
  created_at: string;              // ISO8601
}

// Cache de preços de peças
export interface PartPriceCache {
  codigo_peca: string;
  preco_r$: number;
  fornecedor: string;
  url_origem: string;
  updated_at: string;
}

// Sumário Executivo da Planta
export interface PlantSummary {
  plant_name: string;
  plant_id: string;
  total_records: number;
  total_equipments: number;
  global_oee: number;
  avg_mtbf_hours: number;
  critical_anomalies: number;
  active_alerts: number;
  production_lines: string[];
  generated_at: string;
}

// Payload do snapshot hidratado
export interface PlantDataPayload {
  summary: PlantSummary;
  equipments: Equipment[];
  workOrders: WorkOrder[];
  telemetry: TelemetryRecord[];
}
