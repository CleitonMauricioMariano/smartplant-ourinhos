import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';

export const AiInsightsFeed: React.FC = () => {
  const { openAutoOSModal, openInspectionDrawer } = useFilterStore();

  return (
    <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Cyan/Violet Ambient Accent */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyber-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neon-green text-[20px]">
              psychology
            </span>
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
              AI Predictive Insights (Gemini 3.8)
            </h2>
          </div>
          <span className="font-mono text-[10px] bg-neon-green/15 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
            ACTIVE MODEL
          </span>
        </div>

        {/* Feed Cards */}
        <div className="mt-4 space-y-4">
          {/* Card 1: Critical EQP-0215 */}
          <div className="border-l-4 border-neon-crimson bg-[#1a1215]/85 p-4 rounded-r-xl border-y border-r border-white/[0.05] shadow-lg relative">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-text-primary bg-bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                  EQP-0215
                </span>
                <span className="text-[11px] text-text-secondary">Redutor SEW</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-neon-crimson bg-neon-crimson/20 border border-neon-crimson/50 px-2 py-0.5 rounded">
                88% RISCO CRÍTICO
              </span>
            </div>

            <p className="text-[12px] text-text-primary mt-2.5 leading-relaxed">
              Degradação acelerada no rolamento de entrada do Redutor SEW. Vibração harmônica Inboard atingiu{' '}
              <span className="text-neon-crimson font-mono font-semibold">5.82 mm/s</span> com temperatura de carcaça em{' '}
              <span className="text-neon-orange font-mono font-semibold">84.6°C</span>. Risco iminente de travamento mecânico.
            </p>

            {/* Prescriptive Action List */}
            <div className="mt-3 bg-bg-canvas/80 p-2.5 rounded border border-border-subtle">
              <span className="font-mono text-[10px] text-neon-green uppercase tracking-wider block mb-1">
                Ação Prescritiva Recomendada:
              </span>
              <ul className="text-[11px] text-text-secondary space-y-1 list-disc pl-4">
                <li>Lubrificação emergencial com graxa sintética ISO VG 220;</li>
                <li>Substituição do rolamento cônico SEW-R47-AD2;</li>
                <li>Verificação de desalinhamento angular do eixo acoplado.</li>
              </ul>
            </div>

            {/* Failure Estimation & Supply Chain */}
            <div className="mt-3 pt-2 border-t border-white/[0.06] flex flex-col gap-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Estimativa de Falha:</span>
                <span className="text-neon-crimson font-bold">18 horas até parada</span>
              </div>
              <div className="flex items-center justify-between text-[10px] bg-neon-crimson/10 p-1.5 rounded border border-neon-crimson/25">
                <span className="text-neon-crimson font-semibold">SUPPLY CHAIN: Lead Time 8d (Crítico)</span>
                <span className="text-text-primary">R$ 4.850,00 (SEW Live)</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => openAutoOSModal('EQP-0215')}
              className="w-full mt-3 bg-neon-green/15 hover:bg-neon-green text-neon-green hover:text-bg-canvas border border-neon-green/40 hover:border-neon-green py-2 rounded-lg font-mono text-[12px] font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,230,118,0.25)]"
            >
              <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
              Gerar OS Preditiva Automatizada
            </button>
          </div>

          {/* Card 2: Warning EQP-0104 */}
          <div className="border-l-4 border-neon-amber bg-[#1a1710]/85 p-3.5 rounded-r-xl border-y border-r border-white/[0.05] shadow-lg">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-text-primary bg-bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                  EQP-0104
                </span>
                <span className="text-[11px] text-text-secondary">Enchedora Krones</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-neon-amber bg-neon-amber/20 border border-neon-amber/50 px-2 py-0.5 rounded">
                64% ALERTA
              </span>
            </div>

            <p className="text-[12px] text-text-primary mt-2 leading-relaxed">
              Assinatura espectral de desbalanceamento mecânico na carcaça. Vibração em{' '}
              <span className="text-neon-amber font-mono font-semibold">4.10 mm/s</span> superou o limite basal de 3.8 mm/s.
            </p>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-muted">Desgaste preliminar de pista externa</span>
              <button
                onClick={() => openInspectionDrawer('EQP-0104')}
                className="font-mono text-[11px] text-text-secondary hover:text-neon-green transition-colors flex items-center gap-1"
              >
                Ver Análise Detalhada ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-text-muted mt-3">
        <span>Próxima Inferência: 120s</span>
        <span className="text-neon-green flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
          IA Confidence 99.4%
        </span>
      </div>
    </div>
  );
};
