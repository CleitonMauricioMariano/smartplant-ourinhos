import React, { useState } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { telemetryService } from '../services/telemetryService';
import { StatusBadge } from '../components/ui/StatusBadge';

export const EquipmentPage: React.FC = () => {
  const {
    selectedLine,
    selectedShift,
    selectedStatus,
    searchQuery,
    openInspectionDrawer,
    setFocusedMachineId,
  } = useFilterStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const equipments = telemetryService.getFilteredEquipments(
    selectedLine,
    selectedShift,
    selectedStatus,
    localSearch
  );

  const totalPages = Math.max(1, Math.ceil(equipments.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const displayedEquipments = equipments.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const total = equipments.length;
  const critical = equipments.filter((e) => e.status_atual === 'Risco Crítico de Falha').length;
  const warning = equipments.filter(
    (e) => e.status_atual === 'Alerta de Vibração' || e.status_atual === 'Atenção - Temperatura'
  ).length;
  const normal = equipments.filter((e) => e.status_atual === 'Operando Normal').length;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header & Catalog Summary */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neon-green font-mono text-[11px] mb-1">
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span>CATÁLOGO MESTRE DE ATIVOS CINEMÁTICOS</span>
          </div>
          <h1 className="text-[22px] font-bold text-text-primary">Plant Assets & Kinematics Matrix</h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Monitoramento preditivo contínuo de 400 conjuntos operacionais nas 5 linhas de produção de Ourinhos.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="bg-surface-container-low px-3 py-2 rounded-lg border border-border-subtle flex flex-col">
            <span className="text-text-muted text-[10px]">TOTAL ATIVOS</span>
            <span className="text-[16px] font-bold text-text-primary">{total}</span>
          </div>
          <div className="bg-neon-green/10 px-3 py-2 rounded-lg border border-neon-green/30 flex flex-col">
            <span className="text-neon-green text-[10px]">NORMAL</span>
            <span className="text-[16px] font-bold text-neon-green">{normal}</span>
          </div>
          <div className="bg-neon-amber/10 px-3 py-2 rounded-lg border border-neon-amber/30 flex flex-col">
            <span className="text-neon-amber text-[10px]">ALERTA</span>
            <span className="text-[16px] font-bold text-neon-amber">{warning}</span>
          </div>
          <div className="bg-neon-crimson/10 px-3 py-2 rounded-lg border border-neon-crimson/30 flex flex-col">
            <span className="text-neon-crimson text-[10px]">CRÍTICO</span>
            <span className="text-[16px] font-bold text-neon-crimson">{critical}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted">
            search
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Pesquisar por Código (ex: EQP-0215), Máquina ou Componente..."
            className="w-full h-10 pl-10 pr-4 bg-bg-primary/90 border border-border-subtle rounded-lg text-[12px] font-mono text-text-primary placeholder:text-text-muted focus:border-neon-green focus:outline-none transition-colors"
          />
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pageIndex <= 1}
            className="px-3 py-1.5 bg-surface-container-low border border-border-subtle rounded text-text-secondary hover:text-text-primary disabled:opacity-40"
          >
            ‹ Anterior
          </button>
          <span className="px-2.5 py-1 bg-neon-green/10 text-neon-green rounded border border-neon-green/20">
            Pág {pageIndex} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex >= totalPages}
            className="px-3 py-1.5 bg-surface-container-low border border-border-subtle rounded text-text-secondary hover:text-text-primary disabled:opacity-40"
          >
            Próximo ›
          </button>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedEquipments.map((eq) => {
          const isCrit = eq.status_atual === 'Risco Crítico de Falha';
          const isWarn =
            eq.status_atual === 'Alerta de Vibração' || eq.status_atual === 'Atenção - Temperatura';

          const cardBorder = isCrit
            ? 'border-neon-crimson/50 hover:border-neon-crimson shadow-[0_0_15px_rgba(255,23,68,0.15)]'
            : isWarn
            ? 'border-neon-amber/40 hover:border-neon-amber'
            : 'border-border-subtle hover:border-border-highlight';

          return (
            <div
              key={eq.maquina_id}
              className={`bg-bg-card backdrop-blur-md border rounded-xl p-4 flex flex-col justify-between transition-all group ${cardBorder}`}
            >
              <div>
                {/* Card Top: Asset ID & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[12px] font-bold text-text-primary bg-bg-primary px-2 py-0.5 rounded border border-border-subtle">
                    {eq.maquina_id}
                  </span>
                  <StatusBadge status={eq.status_atual} size="sm" />
                </div>

                {/* Machine Name & Line */}
                <h3 className="text-[14px] font-bold text-text-primary group-hover:text-neon-green transition-colors">
                  {eq.tipo_equipamento}
                </h3>
                <div className="text-[11px] font-mono text-text-muted mt-0.5">{eq.linha_producao}</div>

                {/* Critical Component & Replacement Part */}
                <div className="mt-3 p-2.5 bg-surface-container-lowest/80 rounded border border-white/[0.04] text-[11px] font-mono">
                  <div className="text-text-muted text-[10px] uppercase">Componente Crítico:</div>
                  <div className="text-text-primary font-medium truncate">{eq.componente_critico}</div>
                  <div className="text-neon-green text-[10px] mt-0.5">Part: {eq.codigo_peca_reposicao}</div>
                </div>

                {/* Sensor Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="text-[10px] text-text-muted block">Vibração RMS</span>
                    <span
                      className={`font-bold tabular-nums ${
                        (eq.vibracao_atual || 0) > 3.8 ? 'text-neon-crimson' : 'text-neon-green'
                      }`}
                    >
                      {(eq.vibracao_atual || 2.1).toFixed(2)} mm/s
                    </span>
                  </div>

                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="text-[10px] text-text-muted block">Temperatura</span>
                    <span
                      className={`font-bold tabular-nums ${
                        (eq.temp_atual || 0) > 80 ? 'text-neon-orange' : 'text-text-secondary'
                      }`}
                    >
                      {(eq.temp_atual || 68.0).toFixed(1)} °C
                    </span>
                  </div>
                </div>

                {/* Reliability Metrics */}
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-text-muted pt-2 border-t border-white/[0.04]">
                  <span>MTBF: {eq.mtbf_horas}h</span>
                  <span>MTTR: {eq.mttr_horas}h</span>
                  <span>Lead Time: {eq.lead_time_dias}d</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setFocusedMachineId(eq.maquina_id);
                    openInspectionDrawer(eq.maquina_id);
                  }}
                  className="flex-1 bg-neon-green/10 hover:bg-neon-green text-neon-green hover:text-bg-canvas border border-neon-green/30 hover:border-neon-green py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">search_insights</span>
                  Inspecionar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
