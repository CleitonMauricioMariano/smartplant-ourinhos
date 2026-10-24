# SmartPlant Ourinhos — System Architecture & Orchestration SOP
## Indústria 4.0, Telemetria IoT & Manutenção Preditiva Assistida por IA

---

## 1. CAMADA 1: DIRETIVAS DO AGENTE (SYSTEM CONSTRAINTS)

- **Role:** Principal Full-Stack & Industrial IoT Architect.
- **Princípio de Execução:** Zero placeholders (`// TODO`). Todo módulo, hook, endpoint e script de seed deve ser implementado de ponta a ponta com tratamento de erros e fallback determinístico.
- **Strict Type Safety:** TypeScript em modo `strict: true`. Nenhuma variável pode usar `any`. Validação de entrada/saída com `Zod`.
- **Resiliência Offline/Demo:** Caso as chaves do Firebase ou Gemini API não estejam configuradas no `.env` no primeiro boot, o sistema deve operar em **Local Hydrated Mode** (lendo diretamente o `data_smartplant_manutencao.csv` ou `seedFallback.json` em memória e usando o motor de inferência local de fallback) sem quebrar a interface.

---

## 2. STACK TECNOLÓGICA & ARQUITETURA

- **Frontend Core:** React 18 + TypeScript + Vite
- **Gerenciamento de Estado & Cache:**
  - `Zustand`: Estado global de filtros ativos (Linha, Turno, Tipo de Equipamento, Janela de Tempo), máquina selecionada e controle de Drawers/Modais.
  - `TanStack Query (v5)`: Cache de leituras do Firestore, revalidação de scraping e mutações de Ordens de Serviço (OS).
- **UI & Visualização:** Tailwind CSS + `shadcn/ui` (Radix Primitives) + `Recharts` + `Lucide React` (ícones) + `Framer Motion`.
- **Backend / BaaS:** Firebase v10+ (Firestore para estado persistente + Cloud Functions / Vercel API Routes para Serverless Backend).
- **Motor de IA:** Google `@google/genai` (modelo `gemini-2.5-flash`) configurado com **Structured Outputs** (`responseSchema`) para diagnóstico preditivo e geração de OS.
- **Web Scraping Engine:** Node.js + `playwright-core` + `@sparticuz/chromium` (otimizado para Serverless) com estratégia de *Cache-Aside* (TTL de 24h no Firestore) e fallback imediato para o preço do CSV.

---

## 3. CONTRATOS DE DADOS E INTERFACES (`src/types/smartplant.ts`)

```typescript
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

// Coleção: equipments
export interface Equipment {
  maquina_id: string;              // PK: ex: "EQP-0215"
  tipo_equipamento: string;        // ex: "Paletizador Robótico ABB"
  linha_producao: ProductionLine;
  componente_critico: string;      // ex: "Redutor Planetário SEW-Eurodrive"
  codigo_peca_reposicao: string;   // ex: "SEW-R47-AD2"
  fornecedor_homologado: string;   // ex: "SEW-Eurodrive Brasil"
  custo_estimado_r$: number;
  lead_time_dias: number;
  compra_antecipada_flag: boolean; // Computado: lead_time_dias > 5
  mtbf_horas: number;
  mttr_horas: number;
  status_atual: OperationalStatus;
  risco_parada_percent: number;    // 0 a 100
  updated_at: string;              // ISO8601
}

// Coleção: telemetry (Time-Series indexada por maquina_id + timestamp DESC)
export interface TelemetryRecord {
  registro_id: string;
  timestamp: string;               // ISO8601
  turno: ShiftType;
  maquina_id: string;              // FK -> equipments.maquina_id
  sensor_temp_c: number;
  // Caso o CSV tenha apenas 'sensor_vibracao_mm_s', derivar no parser:
  // inboard = valor_base, outboard = valor_base * 0.82 + oscilação harmônica
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

// Coleção: work_orders
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

// Coleção: parts_price_cache (TTL 24h)
export interface PartPriceCache {
  codigo_peca: string;             // PK
  preco_r$: number;
  fornecedor: string;
  url_origem: string;
  updated_at: string;              // ISO8601
}
```

---

## 4. CAMADA 2: ORQUESTRAÇÃO DE MÓDULOS E REGRAS DE NEGÓCIO

### 4.1 Motor de Regras Determinísticas (`src/services/rulesEngine.ts`)
1. **Avaliação de Thresholds de Telemetria:**
   - `vibracao_max = Math.max(inboard, outboard)`
   - Se `vibracao_max > 6.0` E `sensor_temp_c > 90` → `status = "Risco Crítico de Falha"` | `risco_parada_percent >= 85%`.
   - Senão, se `sensor_temp_c > 80` → `status = "Atenção - Temperatura"`.
   - Senão, se `vibracao_max > 3.8` → `status = "Alerta de Vibração"`.
   - Caso contrário → `status = "Operando Normal"`.
2. **Gatilho de Ordem de Serviço Preditiva (Idempotente):**
   - Quando `risco_parada_percent >= 80%`, verificar se já existe uma OS com `status IN ['aberta', 'em_andamento']` para aquele `maquina_id`.
   - Se **não** existir, disparar automaticamente o pipeline `POST /api/diagnose` + `GET /api/scrape-part/:codigo` e persistir a nova OS.
3. **Regra de Suprimentos (Supply Chain Flag):**
   - Qualquer peça com `lead_time_dias > 5` recebe a flag `compra_antecipada_flag = true` (`COMPRA ANTECIPADA CRÍTICA`) e prioridade elevada na fila de compras.

### 4.2 Módulo IA Preditiva (`/api/diagnose`)
- **Input:** Dados cadastrais da máquina + Array com os últimos 30 registros de `telemetry` da máquina.
- **System Instruction do Gemini:** *"Você é um Engenheiro Chefe de Confiabilidade e Manutenção Preditiva Industrial (certificado CMRP). Analise a curva de degradação termomecânica (vibração Inboard/Outboard, temperatura, corrente e ruído) e emita um laudo técnico objetivo diagnosticando a causa-raiz provável no componente crítico e os passos de intervenção."*
- **Output Obrigatório (`responseSchema` JSON):**
  ```json
  {
    "diagnostico_ia": "string (máx 280 caracteres, direto e técnico)",
    "causa_raiz_provavel": "string",
    "prioridade_sugerida": "baixa | media | alta | critica",
    "acao_recomendada": ["passo 1", "passo 2", "passo 3"],
    "estimativa_horas_ate_falha": 18
  }
  ```

### 4.3 Módulo de Scraping Vivo com Fallback (`/api/scrape-part/:codigo`)
Fluxo de execução (*Circuit Breaker + Cache-Aside*):
1. Consulta `parts_price_cache` no Firestore pelo `codigo_peca`. Se existir e `now - updated_at < 24h`, retorna imediatamente (`fonte_preco: 'firestore_cache'`).
2. Se expirado ou inexistente, inicia `playwright-core` (timeout estrito de 6500ms) buscando o código da peça nos catálogos homologados.
3. Se obtiver sucesso, atualiza `parts_price_cache` e retorna (`fonte_preco: 'live_scraping'`).
4. **Fallback Seguro:** Se houver bloqueio de anti-bot, timeout ou erro de rede, retorna imediatamente o `custo_estimado_r$` do CSV com `fonte_preco: 'csv_fallback'` em menos de 50ms, garantindo que a abertura da OS nunca falhe.

---

## 5. ROTAS E ARQUITETURA DE PÁGINAS

| Rota | View / Componente | Responsabilidade Funcional |
|------|-------------------|----------------------------|
| `/` | `OverviewPage` | Dashboard executivo: Gauge OEE global/filtrado, Telemetria de Vibração (Inboard/Outboard 24h), Telemetria de Temperatura com linha de Threshold, Tabela de Status de Ativos e Feed de AI Insights. |
| `/equipment` | `EquipmentPage` | Catálogo completo de máquinas com filtros combinados (Linha A–E, Turno, Status), cards de MTBF/MTTR e abertura de Drawer lateral com raio-X da máquina. |
| `/telemetry` | `TelemetryPage` | Analisador multivariável sincronizado (Vibração, Temperatura, Pressão PSI, Corrente A e Ruído dB) com seletor de máquina e zoom temporal. |
| `/ai-insights` | `AiInsightsPage` | Central de Ordens de Serviço Preditivas (Kanban/Lista), acionamento manual/automático do Gemini, comparativo de preço (CSV vs. Scraping Vivo) e alerta de Lead Time. |
| `/alerts` | `AlertsCenterPage` | Log cronológico de eventos críticos, anomalias de turno e histórico de disparos de threshold. |
| `/about` | `AboutPage` | Documentação da arquitetura Indústria 4.0, topologia da planta de Ourinhos e status das conexões (Firebase, Gemini API, Scraper Engine). |

---

## 6. CAMADA 3: PLANO DE EXECUÇÃO (STEP-BY-STEP SCAFFOLDING)

```
smartplant-ourinhos/
├── api/                          # Vercel Serverless Functions
│   ├── diagnose.ts               # Integração Gemini API Structured Output
│   └── scrape-part.ts            # Playwright + Cache + CSV Fallback
├── scripts/
│   └── seed-firestore.ts         # Parser do CSV (1200 linhas) -> Firestore + JSON local
├── src/
│   ├── components/
│   │   ├── layout/               # TopNavbar, FilterBar, EquipmentDrawer
│   │   ├── charts/               # OeeGauge, VibrationChart, TemperatureChart
│   │   ├── dashboard/            # EquipmentStatusTable, AiInsightsFeed
│   │   └── ui/                   # StatusBadge, MetricCard, PriceTag, etc.
│   ├── data/
│   │   └── seedFallback.json     # Snapshot local gerado a partir do CSV
│   ├── hooks/                    # useTelemetry, useEquipment, useWorkOrders
│   ├── services/                 # firebase.ts, geminiService.ts, rulesEngine.ts
│   ├── store/                    # useFilterStore.ts (Zustand)
│   ├── types/                    # smartplant.ts
│   └── pages/                    # As 6 páginas mapeadas nas rotas
```

### Critérios de Aceite de Engenharia (Definition of Done)
- [ ] O parser do CSV (`seed-firestore.ts`) deve processar os 1.200 registros de `data_smartplant_manutencao.csv`, populando as coleções em lotes de 450 docs (`batch.commit()`) sem duplicar equipamentos (`equipments` únicos extraídos por `maquina_id`).
- [ ] Os filtros globais (Linha A–E, Turno e Status) e a seleção de máquina na tabela devem recalcular dinamicamente o Gauge de OEE, os gráficos de linha e a tabela em `< 100ms` usando `useMemo`.
- [ ] Clicar em "Inspecionar ›" na tabela de equipamentos deve abrir um Drawer lateral detalhando peça crítica, fornecedor, MTBF/MTTR, cotação ao vivo via Scraper e botão para gerar/visualizar a OS preditiva.