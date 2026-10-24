@echo off
title SmartPlant Ourinhos - Inicializador do Sistema SCADA
cls
echo =====================================================================
echo      SMARTPLANT OURINHOS - INDUSTRIA 4.0 E MANUTENCAO PREDITIVA
echo      Orquestrado com Google Antigravity e Gemini 3.8 Flash
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Verificando dados de fallback da telemetria...
if not exist "frontend\src\data\seedFallback.json" (
    echo [INFO] Gerando dados a partir do CSV industrial...
    node execution\parse_csv_and_seed.js
)

echo [2/3] Iniciando Servidor Backend (Porta 3001)...
start "SmartPlant Backend API" cmd /k "cd backend && node server.js"

echo [3/3] Iniciando Frontend React + Vite (Porta 3000)...
start "SmartPlant Frontend SCADA" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo  Sistema iniciado com sucesso!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:3001
echo =====================================================================
timeout /t 3 >nul
start http://localhost:3000
