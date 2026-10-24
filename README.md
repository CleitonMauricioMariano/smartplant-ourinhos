# 🏭 SmartPlant Ourinhos — Industrial IoT SCADA & Predictive AI

<div align="center">

![Google Antigravity](https://img.shields.io/badge/Google%20Antigravity-v2.5.5-00E676?style=for-the-badge&logo=google&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini%203.8%20Flash-High%20Reasoning-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google Stitch](https://img.shields.io/badge/Google%20Stitch-SCADA%20UI-FFB300?style=for-the-badge&logo=material-design&logoColor=black)
![React 18](https://img.shields.io/badge/React%2018-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Cyber%20SCADA-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20BaaS-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![SENAI](https://img.shields.io/badge/SENAI-Ourinhos%20SP-ED1C24?style=for-the-badge)

<p align="center">
  <strong>🇧🇷 Sistema de Telemetria Industrial IoT, Monitoramento SCADA 4.0 e Manutenção Preditiva com IA</strong><br>
  <strong>🇺🇸 Industrial IoT Telemetry, SCADA 4.0 Monitoring & AI-Assisted Predictive Maintenance System</strong>
</p>

</div>

---

## 🇧🇷 Português do Brasil

### 🌟 Visão Geral do Projeto
O **SmartPlant Ourinhos** é uma plataforma de comando e controle industrial de missão crítica no padrão **Indústria 4.0**. Inspirado em consoles SCADA modernos de plantas químicas, cervejeiras e alimentícias, o sistema realiza monitoramento contínuo de **400 conjuntos cinemáticos e 1.200 registros de telemetria** distribuídos em 5 linhas de produção de alta velocidade.

A aplicação correlaciona vibrações harmônicas (*Inboard* e *Outboard*), gradientes térmicos de carcaça, pressão pneumática, corrente elétrica e níveis de ruído para prever quebras mecânicas até **72 horas antes da falha**, disparando Ordens de Serviço (OS) prescritivas e cotações ao vivo de peças via motor de web scraping.

---

### 🧠 Orquestração e Agentes — Google Antigravity
Este projeto foi concebido, arquitetado e implementado através do ecossistema **Google Antigravity**, operando dentro de uma **Arquitetura de 3 Camadas**:

1. **Camada 1: Diretivas (`/directives/`):** SOPs em Markdown detalhando limites normativos ISO de vibração (3.8 mm/s para alerta e 6.0 mm/s para risco crítico), thresholds térmicos (80°C) e cálculos do OEE (*Overall Equipment Effectiveness*).
2. **Camada 2: Orquestração (Agente de IA Antigravity):** Raciocínio probabilístico e tomadas de decisão estruturadas com **Gemini 3.8 Flash (High)**, auto-recuperação determinística (*Self-Annealing*) e verificação estrita de tipagem TypeScript (`strict: true`).
3. **Camada 3: Execução (`/execution/`):** Scripts determinísticos de automação em Node.js para parsing de CSV, verificação de credenciais em `.env`, testes de API e sincronização resiliente.

#### Agentes & Ferramentas Integradas:
- **Agente Orquestrador Antigravity**: Orquestrador mestre de desenvolvimento e loop de autorrecuperação.
- **Google Stitch MCP**: Extração e renderização do design system de alta fidelidade *Cyber-Industrial SCADA* (Dark Mode, acentos em Verde Neon `#00E676`, Azul Cyber `#2979FF` e Glassmorphism).
- **Google Gemini API**: Modelo `gemini-3.8-flash` com saídas estruturadas (*Structured Outputs*) atuando como Engenheiro Chefe CMRP (*Certified Maintenance & Reliability Professional*).
- **Firebase BaaS**: Firestore para persistência de estado operacional e cache de preços.

---

### 🚀 Funcionalidades Principais
- **Cockpit Overview:** Indicadores de Throughput (14.820 un/h), MTBF Projetado (312.4h) e Anomalias Ativas.
- **Gráficos de Telemetria de Vibração:** Comparativo Inboard vs. Outboard com limites de 3.8 mm/s e 6.0 mm/s em janelas temporais de 24H, 7D e 30D.
- **Telemetria Térmica com Linha de Threshold:** Curva em área coral/vermelha com alerta para temperaturas superiores a 80°C.
- **Gauge Radial OEE em SVG:** Cálculo dinâmico do OEE global e barras de Disponibilidade (88.4%), Performance (82.1%) e Qualidade (94.6%).
- **Matriz de Status de Ativos:** Tabela densa com busca instantânea, paginação e drawer lateral de inspeção raio-X.
- **Feed de AI Insights:** Diagnósticos autônomos gerados pelo Gemini com alertas de *Lead Time* de fornecedor e botão para emissão imediata de Ordem de Serviço.
- **Resiliência Offline (Local Hydrated Mode):** Caso ocorra indisponibilidade de rede ou limites de cota da API, o sistema opera de forma autônoma sem quebrar a interface.

---

### 💻 Como Executar

#### Opção 1: Inicializador Automático (Windows)
Dê um duplo clique no arquivo **`executar.bat`** na raiz do projeto.

#### Opção 2: Manual via Terminal
```bash
# 1. Instalar dependências e iniciar o frontend
cd frontend
npm install
npm run dev

# 2. Em outro terminal, iniciar o backend
cd backend
node server.js
```
Acesse: **[http://localhost:3000](http://localhost:3000)**

---

## 🇺🇸 English

### 🌟 Project Overview
**SmartPlant Ourinhos** is a critical Industry 4.0 industrial command & telemetry center. Designed for modern manufacturing and continuous process plants, it monitors **400 kinematic assets across 1,200 telemetry data points** within 5 production lines.

The platform continuously correlates dual-axis bearing vibration (*Inboard* and *Outboard*), thermal degradation curves, pneumatic pressure, electrical current, and acoustics to forecast mechanical failures up to **72 hours before shutdown**, autonomously issuing predictive Work Orders and live spare part quotes.

---

### 🧠 Orchestration & Agents — Google Antigravity
Built from ground up leveraging the **Google Antigravity** 3-Layer architecture:
- **Layer 1: Directives (`/directives/`):** Engineering SOPs defining ISO vibration threshold standards, OEE algorithms, and CMRP reliability benchmarks.
- **Layer 2: Orchestration (Antigravity AI Agent):** Powered by **Gemini 3.8 Flash (High)** with deterministic self-annealing and strict TypeScript type validation.
- **Layer 3: Execution (`/execution/`):** Resilient Node.js CLI tools for dataset hydration, Firestore sync, and API connectivity probes.

---

### 📦 Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Zustand.
- **Backend:** Node.js, Express, Firebase Firestore, Web Scraping Engine.
- **AI Core:** Google Gemini 3.8 Flash (Structured CMRP Diagnostics).
- **Design System:** Google Stitch Cyber-Industrial SCADA (Immutable Dark Mode + Neon Telemetry).

---

### 👨‍💻 Author & Acknowledgments
- **Institution:** SENAI Ourinhos — São Paulo, Brasil
- **Framework:** Google Antigravity Expert
- **License:** MIT License
