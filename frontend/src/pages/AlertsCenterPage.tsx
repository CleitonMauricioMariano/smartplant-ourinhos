import React, { useState } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { telemetryService } from '../services/telemetryService';
import { StatusBadge } from '../components/ui/StatusBadge';

export const AlertsCenterPage: React.FC = () => {
  const { openInspectionDrawer, openAutoOSModal } = useFilterStore();
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const alerts = telemetryService.getAlertsList();

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'all') return true;
    return a.tipo === severityFilter;
  });

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neon-crimson font-mono text-[11px] mb-1">
            <span className="material-symbols-outlined text-[16px] animate-pulse">crisis_alert</span>
            <span>CENTRAL CRONOLÓGICA DE ALARMES & ANOMALIAS SCADA</span>
          </div>
          <h1 className="text-[22px] font-bold text-text-primary">Plant Alarm & Event Log</h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Registro de violações de thresholds de vibração (&gt;3.8 mm/s), picos térmicos (&gt;80°C) e desvios de MTBF.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-text-muted uppercase">Filtrar Severidade:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-bg-primary border border-border-subtle rounded px-3 py-1.5 text-text-primary focus:border-neon-green focus:outline-none"
          >
            <option value="all">Todas as Anomalias ({alerts.length})</option>
            <option value="Risco Crítico de Falha">Apenas Críticas</option>
            <option value="Alerta de Vibração">Apenas Vibração</option>
            <option value="Atenção - Temperatura">Apenas Temperatura</option>
          </select>
        </div>
      </div>

      {/* Alarm Log Feed */}
      <div className="space-y-3 font-mono">
        {filteredAlerts.map((alt) => {
          const isCritical = alt.tipo === 'Risco Crítico de Falha';

          return (
            <div
              key={alt.id}
              className={`bg-bg-card backdrop-blur-md rounded-xl p-4 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCritical
                  ? 'border-l-4 border-l-neon-crimson border-y border-r border-white/[0.08] bg-neon-crimson/[0.02]'
                  : 'border-l-4 border-l-neon-amber border-y border-r border-white/[0.08]'
              }`}
            >
              {/* Event Metadata */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isCritical
                      ? 'bg-neon-crimson/20 text-neon-crimson'
                      : 'bg-neon-amber/20 text-neon-amber'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isCritical ? 'warning' : 'notifications_active'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-text-primary">{alt.id}</span>
                    <span className="text-text-secondary text-[12px] font-sans">
                      — {alt.equipamento}
                    </span>
                    <StatusBadge status={alt.tipo} size="sm" />
                  </div>

                  <div className="text-[11px] text-text-muted mt-0.5">
                    {alt.linha} • Componente: <strong className="text-text-primary">{alt.componente}</strong>
                  </div>

                  <p className="text-[12px] text-text-secondary mt-1 font-sans line-clamp-1">
                    {alt.diagnostico || 'Desvio detectado na curva espectral da máquina.'}
                  </p>
                </div>
              </div>

              {/* Sensor Readings & Action */}
              <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.05]">
                <div className="text-right text-[11px] tabular-nums">
                  <div className={alt.vibracao > 3.8 ? 'text-neon-crimson font-bold' : 'text-text-secondary'}>
                    Vib: {alt.vibracao.toFixed(2)} mm/s
                  </div>
                  <div className={alt.temperatura > 80 ? 'text-neon-orange font-bold' : 'text-text-secondary'}>
                    Temp: {alt.temperatura.toFixed(1)} °C
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openInspectionDrawer(alt.id)}
                    className="px-2.5 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-text-primary border border-border-subtle hover:border-neon-green/40 transition-all text-[11px]"
                  >
                    Inspecionar
                  </button>

                  <button
                    onClick={() => openAutoOSModal(alt.id)}
                    className="px-3 py-1.5 rounded bg-neon-green/15 hover:bg-neon-green text-neon-green hover:text-bg-canvas border border-neon-green/40 transition-all font-bold text-[11px]"
                  >
                    Abrir OS
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center text-text-muted bg-bg-card rounded-xl border border-border-subtle">
            Nenhuma anomalia ativa encontrada para o filtro selecionado.
          </div>
        )}
      </div>
    </div>
  );
};
