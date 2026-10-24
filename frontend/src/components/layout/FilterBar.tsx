import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';

export const FilterBar: React.FC = () => {
  const {
    selectedLine,
    setSelectedLine,
    selectedShift,
    setSelectedShift,
    selectedStatus,
    setSelectedStatus,
  } = useFilterStore();

  return (
    <div className="fixed top-14 left-0 w-full z-30 h-11 bg-bg-card border-b border-border-subtle backdrop-blur-md">
      <div className="h-full w-full px-6 max-w-[1600px] mx-auto flex items-center justify-between gap-4 overflow-x-auto">
        {/* Rapid Dropdown Filters */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Linha de Produção */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider font-mono">
              Linha:
            </span>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="h-7 bg-bg-primary/90 border border-border-subtle rounded px-2 font-mono text-[11px] text-text-primary focus:border-neon-green focus:outline-none transition-colors"
            >
              <option value="all">Todas as Linhas</option>
              <option value="Linha A - Envasamento">Linha A - Envasamento</option>
              <option value="Linha B - Rotulagem">Linha B - Rotulagem</option>
              <option value="Linha C - Embalagem">Linha C - Embalagem</option>
              <option value="Linha D - Processamento Térmico">Linha D - Processamento Térmico</option>
              <option value="Linha E - Utilidades e Caldeira">Linha E - Utilidades</option>
            </select>
          </div>

          {/* Turno */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider font-mono">
              Turno:
            </span>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="h-7 bg-bg-primary/90 border border-border-subtle rounded px-2 font-mono text-[11px] text-text-primary focus:border-neon-green focus:outline-none transition-colors"
            >
              <option value="all">Todos os Turnos</option>
              <option value="Manhã (06h-14h)">Manhã (06h-14h)</option>
              <option value="Tarde (14h-22h)">Tarde (14h-22h)</option>
              <option value="Noite (22h-06h)">Noite (22h-06h)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider font-mono">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-7 bg-bg-primary/90 border border-border-subtle rounded px-2 font-mono text-[11px] text-text-primary focus:border-neon-green focus:outline-none transition-colors"
            >
              <option value="all">Todos os Status</option>
              <option value="Operando Normal">Operando Normal</option>
              <option value="Alerta de Vibração">Alerta de Vibração</option>
              <option value="Atenção - Temperatura">Atenção - Temperatura</option>
              <option value="Risco Crítico de Falha">Risco Crítico de Falha</option>
            </select>
          </div>
        </div>

        {/* Telemetry Status Beacon */}
        <div className="flex items-center gap-2 shrink-0 pl-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
          </span>
          <span className="font-mono text-[11px] text-neon-green tracking-wider whitespace-nowrap">
            TELEMETRY ONLINE • WEBSOCKET CONNECTED • 1.200 REGISTROS
          </span>
        </div>
      </div>
    </div>
  );
};
