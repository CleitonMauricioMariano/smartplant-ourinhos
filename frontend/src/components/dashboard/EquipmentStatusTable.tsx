import React, { useState } from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { telemetryService } from '../../services/telemetryService';
import { StatusBadge } from '../ui/StatusBadge';

export const EquipmentStatusTable: React.FC = () => {
  const {
    selectedLine,
    selectedShift,
    selectedStatus,
    searchQuery,
    setSearchQuery,
    focusedMachineId,
    setFocusedMachineId,
    openInspectionDrawer,
  } = useFilterStore();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const equipments = telemetryService.getFilteredEquipments(
    selectedLine,
    selectedShift,
    selectedStatus,
    searchQuery
  );

  const totalPages = Math.max(1, Math.ceil(equipments.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const paginatedEquipments = equipments.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  return (
    <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col justify-between">
      <div>
        {/* Table Controls & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-neon-green text-[20px]">
              table_rows
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                Equipment Telemetry Matrix
              </h2>
              <div className="font-mono text-[11px] text-text-muted mt-0.5">
                ESTADO DINÂMICO DOS CONJUNTOS CINEMÁTICOS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-neon-green/10 text-neon-green border border-neon-green/30 px-2.5 py-1 rounded">
              {equipments.length} ATIVOS FILTRADOS
            </span>

            {/* SCADA Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-text-muted">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filtrar Tag / Linha..."
                className="h-8 pl-7 pr-3 bg-bg-primary/90 border border-border-subtle rounded text-[11px] font-mono text-text-primary placeholder:text-text-muted focus:border-neon-green focus:outline-none w-44 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SCADA Dense Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-text-muted font-mono text-[11px] tracking-wider uppercase">
                <th className="py-3 px-3">Asset ID</th>
                <th className="py-3 px-3">Equipamento &amp; Linha</th>
                <th className="py-3 px-3">Componente Crítico</th>
                <th className="py-3 px-3">Sensores (Vib / Temp)</th>
                <th className="py-3 px-3">Status Operacional</th>
                <th className="py-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-[12px]">
              {paginatedEquipments.map((eq) => {
                const isCritical = eq.status_atual === 'Risco Crítico de Falha';
                const isWarning =
                  eq.status_atual === 'Alerta de Vibração' ||
                  eq.status_atual === 'Atenção - Temperatura';
                const isFocused = focusedMachineId === eq.maquina_id;

                const borderLeftClass = isCritical
                  ? 'border-l-2 border-neon-crimson bg-neon-crimson/[0.03]'
                  : isWarning
                  ? 'border-l-2 border-neon-amber bg-neon-amber/[0.02]'
                  : 'border-l-2 border-transparent';

                return (
                  <tr
                    key={eq.maquina_id}
                    onClick={() => setFocusedMachineId(eq.maquina_id)}
                    className={`hover:bg-bg-elevated/70 transition-colors cursor-pointer ${borderLeftClass} ${
                      isFocused ? 'bg-white/[0.04]' : ''
                    }`}
                  >
                    {/* Asset ID */}
                    <td className="py-3 px-3 font-mono font-semibold text-text-primary">
                      <span className="flex items-center gap-1.5">
                        {isFocused && (
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
                        )}
                        {eq.maquina_id}
                      </span>
                    </td>

                    {/* Equipamento & Linha */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-text-primary">
                        {eq.tipo_equipamento}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono">
                        {eq.linha_producao}
                      </div>
                    </td>

                    {/* Componente Crítico */}
                    <td className="py-3 px-3">
                      <div className="text-text-secondary font-medium">
                        {eq.componente_critico}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono">
                        {eq.codigo_peca_reposicao}
                      </div>
                    </td>

                    {/* Sensores */}
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <div
                        className={
                          (eq.vibracao_atual || 0) > 3.8
                            ? 'text-neon-crimson font-bold'
                            : 'text-neon-green'
                        }
                      >
                        Vib: {(eq.vibracao_atual || 2.1).toFixed(2)} mm/s
                      </div>
                      <div
                        className={
                          (eq.temp_atual || 0) > 80
                            ? 'text-neon-orange font-bold'
                            : 'text-text-secondary'
                        }
                      >
                        Temp: {(eq.temp_atual || 68.0).toFixed(1)}°C
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <StatusBadge status={eq.status_atual} size="sm" />
                    </td>

                    {/* Ação */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInspectionDrawer(eq.maquina_id);
                        }}
                        className="font-mono text-[11px] font-semibold text-neon-green hover:text-bg-canvas hover:bg-neon-green border border-neon-green/40 hover:border-neon-green px-2.5 py-1 rounded transition-all shadow-[0_0_8px_rgba(0,230,118,0.2)]"
                      >
                        Inspecionar ›
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginatedEquipments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted font-mono">
                    Nenhum equipamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer / Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.05] font-mono text-[11px] text-text-muted mt-3">
        <span>
          Mostrando {paginatedEquipments.length} de {equipments.length} equipamentos monitorados
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pageIndex <= 1}
            className="px-2 py-1 bg-surface-container-low border border-border-subtle rounded text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
          >
            ‹ Anterior
          </button>
          <span className="px-2 py-0.5 bg-neon-green/10 text-neon-green rounded border border-neon-green/20">
            Pág {pageIndex} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex >= totalPages}
            className="px-2 py-1 bg-surface-container-low border border-border-subtle rounded text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
          >
            Próximo ›
          </button>
        </div>
      </div>
    </div>
  );
};
