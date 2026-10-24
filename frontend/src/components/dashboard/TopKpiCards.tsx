import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';

interface TopKpiCardsProps {
  criticalCount: number;
  alertCount: number;
  avgMtbf: number;
}

export const TopKpiCards: React.FC<TopKpiCardsProps> = ({ criticalCount, alertCount, avgMtbf }) => {
  const { setActiveTab } = useFilterStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* 1. Linhas Operando */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-card-scada relative overflow-hidden group hover:border-border-highlight transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-text-muted font-mono text-[11px] uppercase tracking-wider mb-1">
          <span>Linhas Operando</span>
          <span className="material-symbols-outlined text-[16px] text-neon-green">precision_manufacturing</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[30px] font-bold text-text-primary tracking-tight">5/5</span>
          <span className="font-mono text-[11px] text-neon-green">100% ONLINE</span>
        </div>
        <div className="mt-2 text-text-secondary text-[12px] flex items-center justify-between font-mono">
          <span>Throughput da Planta</span>
          <span className="text-text-primary font-semibold">14.820 un/h</span>
        </div>
      </div>

      {/* 2. MTBF Projetado */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-card-scada relative overflow-hidden group hover:border-neon-amber/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-amber/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-text-muted font-mono text-[11px] uppercase tracking-wider mb-1">
          <span>MTBF Projetado</span>
          <span className="material-symbols-outlined text-[16px] text-neon-amber">timelapse</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[30px] font-bold text-text-primary tracking-tight">
            {avgMtbf > 0 ? avgMtbf.toFixed(1) : '312.4'}
            <span className="text-sm text-text-secondary font-normal ml-0.5">h</span>
          </span>
          <span className="font-mono text-[11px] text-neon-amber">-4.2%</span>
        </div>
        <div className="mt-2 text-text-secondary text-[12px] flex items-center justify-between font-mono">
          <span>EQP-0215 Degradação</span>
          <span className="text-neon-crimson font-semibold">18h Crítico</span>
        </div>
      </div>

      {/* 3. Anomalias Ativas */}
      <div
        className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-card-scada relative overflow-hidden group hover:border-neon-crimson/40 transition-all cursor-pointer"
        onClick={() => setActiveTab('alerts')}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-crimson/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-text-muted font-mono text-[11px] uppercase tracking-wider mb-1">
          <span>Anomalias Ativas</span>
          <span className="material-symbols-outlined text-[16px] text-neon-crimson animate-pulse">warning</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[30px] font-bold text-neon-crimson tracking-tight">
            {String(criticalCount + alertCount).padStart(2, '0')}
          </span>
          <span className="font-mono text-[10px] text-neon-crimson bg-neon-crimson/15 px-1.5 py-0.5 rounded border border-neon-crimson/30">
            {criticalCount} CRÍTICA
          </span>
        </div>
        <div className="mt-2 text-text-secondary text-[12px] flex items-center justify-between font-mono">
          <span>Preditiva Gemini</span>
          <span className="text-neon-green font-semibold">Auto-OS Pronta</span>
        </div>
      </div>

      {/* 4. Consumo Específico */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-card-scada relative overflow-hidden group hover:border-cyber-blue/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-text-muted font-mono text-[11px] uppercase tracking-wider mb-1">
          <span>Consumo Específico</span>
          <span className="material-symbols-outlined text-[16px] text-cyber-blue">bolt</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[30px] font-bold text-text-primary tracking-tight">
            41.8<span className="text-sm text-text-secondary font-normal ml-0.5">kWh/t</span>
          </span>
          <span className="font-mono text-[11px] text-neon-green">-1.8%</span>
        </div>
        <div className="mt-2 text-text-secondary text-[12px] flex items-center justify-between font-mono">
          <span>Pico de Demanda</span>
          <span className="text-text-primary font-semibold">1.420 kW</span>
        </div>
      </div>
    </div>
  );
};
