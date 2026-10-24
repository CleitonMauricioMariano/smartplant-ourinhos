# 🚀 Instruções de Execução e Operação — SmartPlant Ourinhos

Guia técnico para inicialização, desenvolvimento, testes e execução do ecossistema **SmartPlant Ourinhos (SCADA 4.0 & Manutenção Preditiva com IA)**.

---

## 🛠️ 1. Pré-Requisitos

- **Node.js**: Versão 18.x ou superior recomendada.
- **NPM**: Gerenciador de pacotes padrão.
- **Navegador**: Google Chrome, Edge ou Firefox com suporte a CSS Grid e WebSockets.

---

## ⚡ 2. Inicialização Rápida (One-Click no Windows)

Para iniciar automaticamente o frontend e backend com uma única ação:
1. Execute o arquivo **`executar.bat`** na raiz do projeto.
2. O script iniciará o servidor backend na porta `3001` e o frontend na porta `3000`, abrindo o navegador automaticamente.

---

## 💻 3. Execução Manual via Terminal

### 3.1 Frontend (React 18 + Vite + Tailwind CSS)
```bash
cd frontend
npm run dev
```
Acesse no navegador: **[http://localhost:3000](http://localhost:3000)**

### 3.2 Backend (Express + Gemini API + Scraper)
```bash
cd backend
node server.js
```
Endpoint da API: **[http://localhost:3001/api/health](http://localhost:3001/api/health)**

---

## 📊 4. Pipelines de Dados e Scripts de Execução (`/execution/`)

- **Reprocessar CSV industrial (1.200 linhas) e gerar snapshot:**
  ```bash
  node execution/parse_csv_and_seed.js
  ```
- **Testar conectividade com o modelo Gemini 3.8 Flash:**
  ```bash
  node execution/test_gemini.js
  ```
- **Testar autenticação da chave do GitHub:**
  ```bash
  node execution/check_github.js
  ```

---

## 🌐 5. Endpoints Principais da API Backend

- `GET /api/health` — Status dos subsistemas (Firebase, Gemini 3.8, Scraper).
- `GET /api/telemetry` — Sumário global e amostra da série temporal de sensores.
- `GET /api/equipments` — Catálogo dos 400 ativos industriais da planta.
- `GET /api/scrape-part/:codigo` — Cotação ao vivo de peças com cache-aside e fallback do CSV.
- `POST /api/diagnose` — Diagnóstico preditivo estruturado via Gemini 3.8 Flash.

---
*SmartPlant Ourinhos — Desenvolvido com Google Antigravity*
