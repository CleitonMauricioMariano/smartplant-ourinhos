# SmartPlant Ourinhos — Design System & UI Specification
## Estética: Cyber-Industrial SCADA (Dark Mode, Neon Accents & Glassmorphism)

---

## 1. DIRETRIZ ESTÉTICA E ATMOSFERA VISUAL

Interface de missão crítica inspirada em centros de comando **Indústria 4.0 / SCADA Moderno**.
- **Atmosfera:** Fundo ultra-escuro profundo (`#07090E` e `#0B0E14`), superfícies translúcidas com **Glassmorphism** (`backdrop-blur-md`), bordas iluminadas sutis e destaque cirúrgico em **Verde Neon (`#00E676`)** para eficiência e telemetria saudável.
- **Sensação de Profundidade (3D Elevation):** Cards principais e indicadores críticos utilizam sombras projetadas e brilho periférico (*ambient glow*) que reagem ao hover e ao estado de alerta da máquina.
- **Dark Mode Nativo e Permanente:** Sem toggle para tema claro (telas de sala de controle operam exclusivamente em modo escuro para reduzir fadiga visual).

---

## 2. DESIGN TOKENS & VARIÁVEIS CSS (`src/index.css`)

```css
:root {
  /* Surface & Backgrounds */
  --bg-canvas: #07090E;                        /* Fundo global da aplicação */
  --bg-primary: #0B0E14;                       /* Container principal */
  --bg-card: rgba(19, 24, 32, 0.78);           /* Card com Glassmorphism */
  --bg-card-solid: #131820;                    /* Fallback sólido */
  --bg-elevated: rgba(26, 32, 44, 0.85);       /* Hover de linhas, inputs e drawers */

  /* Glass & Borders */
  --border-subtle: rgba(255, 255, 255, 0.07);  /* Borda padrão de painel */
  --border-highlight: rgba(0, 230, 118, 0.35); /* Borda neon ativa */
  --glass-blur: blur(12px);

  /* Typography Colors */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  /* Semantic Telemetry Colors */
  --neon-green: #00E676;                       /* OEE Alto / Operando Normal */
  --neon-amber: #FFB300;                       /* Alerta de Vibração */
  --neon-orange: #FF6D00;                      /* Atenção - Temperatura */
  --neon-crimson: #FF1744;                     /* Risco Crítico de Falha */
  --cyber-blue: #2979FF;                       /* Série Outboard / IA Info */

  /* Glow Shadows (3D Floating Effect) */
  --glow-success: 0 0 20px rgba(0, 230, 118, 0.18);
  --glow-warning: 0 0 20px rgba(255, 179, 0, 0.18);
  --glow-danger: 0 0 25px rgba(255, 23, 68, 0.30);
  --card-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}
```

---

## 3. TIPOGRAFIA E HIERARQUIA DE DADOS

Importar via Google Fonts no `index.html`: **`Inter`** (400, 500, 600, 700) e **`JetBrains Mono`** (400, 600, 700).

- **Títulos de Seção (Card Headers):** `Inter`, `12px–13px`, `font-semibold`, `uppercase`, `tracking-wider` (`0.06em`), cor `--text-secondary`.
- **KPIs Numéricos / Leituras de Sensores / Códigos de Peça / Timestamps:** **Obrigatório** usar `JetBrains Mono` com `font-variant-numeric: tabular-nums` (impede que os números oscilem horizontalmente durante atualizações em tempo real).
- **Valor Central do Gauge OEE:** `JetBrains Mono`, `40px–44px`, `font-bold`, cor `--neon-green` com `text-shadow: 0 0 16px rgba(0, 230, 118, 0.4)`.

---

## 4. ESPECIFICAÇÃO DOS COMPONENTES PRINCIPAIS

### 4.1 Top Navigation Bar & Global Filter Bar
- **Header Principal (56px):** Fundo `rgba(11, 14, 20, 0.85)` com `backdrop-blur-md` e `border-b border-white/[0.07]` fixo no topo (`sticky top-0 z-40`).
  - **Brand:** Ícone industrial em verde neon (`#00E676`) + texto **SmartPlant** (`font-bold text-white`) + badge `OURINHOS` em `JetBrains Mono text-xs bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 px-2 py-0.5 rounded`.
  - **Tabs:** `Overview | Equipment | Telemetry | AI Insights | Alerts | About`. Aba ativa recebe sublinhado verde neon (`#00E676`) com glow.
- **Sub-barra de Filtros Rápidos (44px):**
  - Seletores compactos para **Linha de Produção (Todas | Linha A..E)**, **Turno (Todos | Manhã | Tarde | Noite)**, **Status** e indicador de conexão em tempo real (`● TELEMETRY ONLINE`).

### 4.2 Card 1: Vibration Telemetry (`VibrationChart.tsx`)
- **Header do Card:** Título `"VIBRATION TELEMETRY (MM/S)"` à esquerda; à direita, seletor de janela temporal (`24H | 7D | 30D`) e legenda das duas séries.
- **Gráfico (`Recharts ComposedChart` ou SVG Responsivo):**
  - **Eixo X:** Horários formatados em `JetBrains Mono` (`00:00`, `04:00` ... `24:00`).
  - **Eixo Y:** `0` a `10 mm/s` (com linha de referência amarela tracejada em `3.8 mm/s` e vermelha em `6.0 mm/s`).
  - **Série 1 — Inboard Bearings:** Linha suave (`#00E676`), `strokeWidth={2.5}`, com área sombreada em gradiente linear vertical (`rgba(0, 230, 118, 0.20)` → `0.0`).
  - **Série 2 — Outboard Bearings:** Linha suave (`#2979FF`), `strokeWidth={2}`.
  - **Tooltip Customizado:** Card glassmorphic (`bg-[#0B0E14]/95 border border-white/10 backdrop-blur-md p-3 rounded-lg`) exibindo timestamp exato e valores Inboard/Outboard em `JetBrains Mono`.

### 4.3 Card 2: Temperature Telemetry (`TemperatureChart.tsx`)
- **Gráfico (`Recharts AreaChart`):**
  - Série principal em vermelho/coral (`#FF5252`), preenchimento com `<linearGradient>` de `rgba(255, 82, 82, 0.28)` até `rgba(255, 82, 82, 0.0)`.
  - **`ReferenceLine` Crítica:** Linha tracejada horizontal em `y={80}` com label `"THRESHOLD 80°C"` alinhada à direita em `JetBrains Mono text-[11px] text-[#FFB300]`.

### 4.4 Card 3: OEE Radial Gauge (`OeeGauge.tsx`)
- **Construção SVG Pura (200×200px):**
  - Círculo de trilha (`stroke="rgba(255,255,255,0.06)"`, `strokeWidth="14"`).
  - Círculo de progresso (`stroke="#00E676"`, `strokeWidth="14"`, `strokeLinecap="round"`) com filtro SVG `<feDropShadow>` para efeito neon e transição suave de `stroke-dashoffset` (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
  - **Centro do Gauge:** Valor principal (ex: `84.2%`) + label `"GLOBAL OEE"`.
- **Sub-métricas Inferiores (3 barras horizontais compactas):**
  - `Availability` (ex: `88%`), `Performance` (ex: `82%`), `Quality` (ex: `94%`) com mini barras de progresso individuais.

### 4.5 Card 4: Equipment Status Table (`EquipmentStatusTable.tsx`)
- **Colunas:** `ASSET ID | EQUIPAMENTO & LINHA | COMPONENTE CRÍTICO | SENSORES (VIB / TEMP) | STATUS | AÇÃO`
- **Estilização das Células:**
  - `ASSET ID`: Badge monospace `EQP-0215` com borda sutil.
  - `STATUS`: Componente `<StatusBadge status={...} />` com dot luminoso pulsante para estado crítico.
  - `AÇÃO`: Botão estilizado `"Inspecionar ›"` (`hover:bg-[#00E676]/10 hover:text-[#00E676] hover:border-[#00E676]/40 transition-all`) que abre o Drawer lateral de diagnóstico da máquina.

### 4.6 Card 5: AI Predictive Insights & Auto-OS (`AiInsightsFeed.tsx`)
- Lista de diagnósticos acionáveis gerados pelo motor de regras + Gemini:
  - Card interno com barra lateral esquerda colorida conforme severidade (`border-l-2 border-[#FF1744]` ou `#FFB300`).
  - Exibe código da máquina, resumo técnico da degradação e recomendação prescritiva.
  - Exibe tag de **Lead Time** (`Lead Time: 8d — Compra Antecipada`) e cotação da peça.
  - Botão de ação rápida: `"Gerar OS Preditiva"` ou `"Ver OS #OS-2026-0891"`.

---

## 5. GRID LAYOUT E RESPONSIVIDADE (OVERVIEW)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [⚙️ SmartPlant OURINHOS]   Overview  Equipment  Telemetry  AI Insights │
├────────────────────────────────────────────────────────────────────────┤
│ Filtros: [Linha: Todas ▾] [Turno: Todos ▾] [Status: Todos ▾]  ● ONLINE │
├─────────────────────────────┬──────────────────────┬───────────────────┤
│ VIBRATION TELEMETRY (5 col) │ TEMP TELEMETRY (4col)│ OEE GAUGE (3 col) │
│ [Inboard vs Outboard 24h]   │ [Area + Threshold]   │ [Radial SVG 84%]  │
├─────────────────────────────┴───────────┬──────────┴───────────────────┤
│ EQUIPMENT STATUS MATRIX (8 col)         │ AI PREDICTIVE INSIGHTS (4col)│
│ [Asset | Componente | Sensores | Ação]  │ [Alertas + Geração de OS]    │
└─────────────────────────────────────────┴──────────────────────────────┘
```

- **Sistema de Grid:** `grid-cols-12 gap-5 p-6 max-w-[1600px] mx-auto`:
  - **Linha 1:** Vibration (`col-span-12 xl:col-span-5`), Temperature (`col-span-12 md:col-span-7 xl:col-span-4`), OEE Gauge (`col-span-12 md:col-span-5 xl:col-span-3`).
  - **Linha 2:** Equipment Table (`col-span-12 xl:col-span-8`), AI Insights (`col-span-12 xl:col-span-4`).

---

## 6. MATRIZ DE ESTADOS VISUAIS E MICROINTERAÇÕES

| Status Operacional | Cor Primária | Estilo da Badge (`StatusBadge`) | Comportamento do Card / Linha |
|--------------------|--------------|---------------------------------|-------------------------------|
| `Operando Normal` | `#00E676` | `bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30` | Borda padrão `--border-subtle` |
| `Alerta de Vibração` | `#FFB300` | `bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/30` | Hover destaca borda âmbar |
| `Atenção - Temperatura` | `#FF6D00` | `bg-[#FF6D00]/10 text-[#FF6D00] border-[#FF6D00]/30` | Ícone de termômetro pulsante |
| `Risco Crítico de Falha` | `#FF1744` | `bg-[#FF1744]/15 text-[#FF1744] border-[#FF1744]/50` | Dot com `animate-ping`, borda `rgba(255,23,68,0.45)` e `--glow-danger` |

---

## 7. CHECKLIST DE ENTREGA VISUAL

- [ ] Tema escuro Cyber-Industrial SCADA permanente com superfícies em Glassmorphism (`backdrop-blur-md`)
- [ ] Gauge OEE em SVG puro animado com 3 sub-métricas (`Availability`, `Performance`, `Quality`)
- [ ] Gráfico de vibração com 2 séries simultâneas (`Inboard` em verde neon e `Outboard` em azul cyber)
- [ ] Gráfico de temperatura em área vermelha com linha tracejada de `Threshold 80°C`
- [ ] Tabela interativa de equipamentos que filtra os gráficos ao clicar na máquina e abre o Drawer ao clicar em `Inspecionar ›`
- [ ] Card de AI Insights com geração de Ordem de Serviço Preditiva e badge de `Compra Antecipada` para `lead_time > 5 dias`