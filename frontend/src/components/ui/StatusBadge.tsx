import React from 'react';
import { OperationalStatus } from '../../types/smartplant';

interface StatusBadgeProps {
  status: OperationalStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const baseClasses = `inline-flex items-center gap-1.5 font-mono ${
    isSm ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'
  } font-semibold rounded border transition-all`;

  switch (status) {
    case 'Risco Crítico de Falha':
      return (
        <span className={`${baseClasses} bg-neon-crimson/15 text-neon-crimson border-neon-crimson/50 shadow-[0_0_12px_rgba(255,23,68,0.25)]`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-crimson opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-crimson"></span>
          </span>
          Risco Crítico de Falha
        </span>
      );

    case 'Alerta de Vibração':
      return (
        <span className={`${baseClasses} bg-neon-amber/10 text-neon-amber border-neon-amber/40 shadow-[0_0_10px_rgba(255,179,0,0.18)]`}>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-amber"></span>
          Alerta de Vibração
        </span>
      );

    case 'Atenção - Temperatura':
      return (
        <span className={`${baseClasses} bg-neon-orange/10 text-neon-orange border-neon-orange/40 shadow-[0_0_10px_rgba(255,109,0,0.18)]`}>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-orange animate-pulse"></span>
          Atenção - Temperatura
        </span>
      );

    case 'Operando Normal':
    default:
      return (
        <span className={`${baseClasses} bg-neon-green/10 text-neon-green border-neon-green/30`}>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
          Operando Normal
        </span>
      );
  }
};
