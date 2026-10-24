import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { telemetryService } from '../../services/telemetryService';

export const InspectionDrawer: React.FC = () => {
  const { inspectedEquipmentId, isDrawerOpen, closeInspectionDrawer, openAutoOSModal } =
    useFilterStore();

  if (!isDrawerOpen || !inspectedEquipmentId) return null;

  const eq = telemetryService.getEquipmentById(inspectedEquipmentId);
  const isCritical = eq?.status_atual === 'Risco Crítico de Falha';
  const isWarning =
    eq?.status_atual === 'Alerta de Vibração' || eq?.status_atual === 'Atenção - Temperatura';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeInspectionDrawer}
      ></div>

      {/* Drawer Panel */}
      <div className="relative h-full w-full max-w-[500px] bg-[#0B0E14] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-neon-green text-[24px]">
                precision_manufacturing
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-text-primary">Diagnóstico Profundo</h3>
                <div className="font-mono text-[11px] text-neon-green">
                  ASSET TAG: {inspectedEquipmentId}
                </div>
              </div>
            </div>

            <button
              onClick={closeInspectionDrawer}
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Machine Info Header */}
          <div className="mt-4 p-3 bg-surface-container-low rounded-lg border border-border-subtle font-mono text-[11px]">
            <div className="text-text-primary font-bold text-[13px]">{eq?.tipo_equipamento}</div>
            <div className="text-text-secondary mt-0.5">{eq?.linha_producao}</div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/[0.05]">
              <span className="text-text-muted">MTBF: {eq?.mtbf_horas}h</span>
              <span className="text-text-muted">MTTR: {eq?.mttr_horas}h</span>
              <span className="text-neon-green">Horas Uso: {eq?.horas_uso || 1650}h</span>
            </div>
          </div>

          {/* Telemetry Breakdown */}
          <div className="mt-4 p-4 rounded-xl bg-bg-card border border-border-subtle">
            <div className="flex justify-between items-center mb-3 font-mono">
              <span className="text-[11px] text-text-muted uppercase">Status do Sensor</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  isCritical
                    ? 'text-neon-crimson bg-neon-crimson/15 border-neon-crimson/40'
                    : isWarning
                    ? 'text-neon-amber bg-neon-amber/15 border-neon-amber/40'
                    : 'text-neon-green bg-neon-green/15 border-neon-green/40'
                }`}
              >
                {isCritical ? 'LIMIT BREACH' : isWarning ? 'WARNING THRESHOLD' : 'NOMINAL ENVELOPE'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="bg-surface-container-lowest p-2.5 rounded border border-white/[0.04]">
                <span className="text-[10px] text-text-muted block">Vibração RMS</span>
                <span
                  className={`font-bold text-[16px] tabular-nums ${
                    isCritical ? 'text-neon-crimson' : isWarning ? 'text-neon-amber' : 'text-neon-green'
                  }`}
                >
                  {(eq?.vibracao_atual || 5.82).toFixed(2)} mm/s
                </span>
                <span className="text-[10px] text-neon-amber block mt-0.5">
                  {isCritical ? '+48% do nominal' : 'Dentro do limite'}
                </span>
              </div>

              <div className="bg-surface-container-lowest p-2.5 rounded border border-white/[0.04]">
                <span className="text-[10px] text-text-muted block">Temperatura</span>
                <span
                  className={`font-bold text-[16px] tabular-nums ${
                    (eq?.temp_atual || 0) > 80 ? 'text-neon-orange' : 'text-neon-green'
                  }`}
                >
                  {(eq?.temp_atual || 84.6).toFixed(1)} °C
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5">Max Perm: 80.0 °C</span>
              </div>
            </div>
          </div>

          {/* Component Anatomy & Supply Chain Live Scraping */}
          <div className="mt-4 p-4 rounded-xl bg-bg-card border border-border-subtle">
            <div className="flex items-center justify-between mb-2 font-mono">
              <span className="text-[11px] text-text-muted uppercase">Supply Chain &amp; Scraping</span>
              <span className="text-[10px] text-cyber-blue flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse"></span>
                Live Scraper Active
              </span>
            </div>

            <div className="text-[12px] text-text-secondary mb-3">
              Componente Crítico:{' '}
              <strong className="text-text-primary font-mono">{eq?.componente_critico}</strong>
              <div className="text-[11px] font-mono text-neon-green mt-0.5">
                Código: {eq?.codigo_peca_reposicao}
              </div>
            </div>

            {/* Price Scraping Comparison Matrix */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-surface-container-low border border-neon-green/30 flex items-center justify-between">
                <div>
                  <div className="text-text-primary font-semibold flex items-center gap-1">
                    <span>{eq?.fornecedor_homologado}</span>
                    <span className="text-[9px] bg-neon-green/20 text-neon-green px-1 py-0.2 rounded">
                      HOMOLOGADO
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Lead Time: {eq?.lead_time_dias} dias úteis{' '}
                    {eq?.compra_antecipada_flag && (
                      <span className="text-neon-crimson font-bold">(COMPRA ANTECIPADA)</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neon-green font-bold text-[13px]">
                    R$ {(eq?.custo_estimado_r$ ? eq.custo_estimado_r$ * 0.93 : 4850).toFixed(2)}
                  </span>
                  <div className="text-[9px] text-text-secondary">Scraping: há 14 min</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-surface-container-low border border-border-subtle flex items-center justify-between opacity-80">
                <div>
                  <div className="text-text-primary font-semibold">Distribuidor Regional Bauru/Ourinhos</div>
                  <div className="text-[10px] text-text-muted">Estoque Imediato</div>
                </div>
                <div className="text-right">
                  <span className="text-text-primary font-bold text-[13px]">
                    R$ {(eq?.custo_estimado_r$ || 5220).toFixed(2)}
                  </span>
                  <div className="text-[9px] text-text-muted">CSV Fallback</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini Prescriptive Execution Plan */}
          <div className="mt-4 p-4 rounded-xl bg-bg-card border border-border-subtle">
            <span className="font-mono text-[11px] text-neon-green uppercase tracking-wider block mb-2">
              Procedimento de Manutenção Prescritiva (Gemini)
            </span>
            <div className="text-[12px] text-text-secondary space-y-2 leading-relaxed">
              <p>
                <strong className="text-text-primary">Etapa 1:</strong> Bloqueio LOTO (Lockout/Tagout) no
                painel elétrico da linha correspondente.
              </p>
              <p>
                <strong className="text-text-primary">Etapa 2:</strong> Drenagem do óleo lubrificante e
                inspeção espectrométrica de partículas metálicas.
              </p>
              <p>
                <strong className="text-text-primary">Etapa 3:</strong> Extração da peça defeituosa{' '}
                {eq?.codigo_peca_reposicao} com extrator hidráulico e substituição calibrada.
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer Buttons */}
        <div className="pt-4 mt-6 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={() => {
              closeInspectionDrawer();
              openAutoOSModal(inspectedEquipmentId);
            }}
            className="w-full bg-neon-green hover:bg-neon-green/90 text-bg-canvas font-mono text-[12px] font-bold py-2.5 rounded-lg uppercase tracking-wider shadow-[0_0_20px_rgba(0,230,118,0.4)] flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            Emitir Ordem de Serviço Automatizada
          </button>
          <button
            onClick={closeInspectionDrawer}
            className="w-full bg-surface-container hover:bg-surface-container-high text-text-secondary font-mono text-[11px] py-2 rounded-lg transition-colors"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
