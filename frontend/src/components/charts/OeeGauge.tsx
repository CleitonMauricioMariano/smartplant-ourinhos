import React from 'react';

interface OeeGaugeProps {
  oeeValue?: number;
  availability?: number;
  performance?: number;
  quality?: number;
}

export const OeeGauge: React.FC<OeeGaugeProps> = ({
  oeeValue = 84.2,
  availability = 88.4,
  performance = 82.1,
  quality = 94.6,
}) => {
  // Cálculo SVG: raio = 66, circunferência = 2 * PI * 66 ≈ 414.69
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (oeeValue / 100) * circumference;

  return (
    <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col justify-between relative overflow-hidden group">
      {/* Green Ambient Glow */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-neon-green/10 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neon-green text-[18px]">
              donut_large
            </span>
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
              Plant OEE Efficiency
            </h2>
          </div>
          <span className="font-mono text-[10px] text-text-muted bg-surface-container-high px-2 py-0.5 rounded border border-border-subtle">
            TARGET: 85.0%
          </span>
        </div>

        {/* Circular Radial Gauge */}
        <div className="relative flex items-center justify-center my-3">
          <svg className="w-[180px] h-[180px] -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Trail */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="14"
            />
            {/* Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#00E676"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 230, 118, 0.45))',
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>

          {/* Center Stats */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className="font-mono text-[34px] font-bold text-neon-green tracking-tight tabular-nums leading-none"
              style={{ textShadow: '0 0 18px rgba(0,230,118,0.5)' }}
            >
              {oeeValue.toFixed(1)}%
            </span>
            <span className="font-mono text-[10px] text-text-secondary tracking-widest mt-1 uppercase">
              GLOBAL OEE
            </span>
            <span className="font-mono text-[9px] text-neon-amber mt-0.5">
              {oeeValue >= 85 ? '+0.4% do target' : '-0.8% do target'}
            </span>
          </div>
        </div>

        {/* Compact Sub-metric Breakdown Bars */}
        <div className="space-y-2 pt-1 font-mono text-[11px]">
          {/* Disponibilidade */}
          <div>
            <div className="flex justify-between text-text-secondary mb-1">
              <span>Disponibilidade</span>
              <span className="text-neon-green font-semibold tabular-nums">{availability.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green rounded-full shadow-[0_0_8px_#00E676] transition-all duration-500"
                style={{ width: `${availability}%` }}
              ></div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <div className="flex justify-between text-text-secondary mb-1">
              <span>Performance</span>
              <span className="text-neon-amber font-semibold tabular-nums">{performance.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-amber rounded-full shadow-[0_0_8px_#FFB300] transition-all duration-500"
                style={{ width: `${performance}%` }}
              ></div>
            </div>
          </div>

          {/* Qualidade */}
          <div>
            <div className="flex justify-between text-text-secondary mb-1">
              <span>Qualidade</span>
              <span className="text-primary font-semibold tabular-nums text-neon-green">{quality.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green rounded-full shadow-[0_0_8px_#00E676] transition-all duration-500"
                style={{ width: `${quality}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-text-muted mt-2">
        <span>Turno Vigente: 2.180 un/h</span>
        <span className="text-neon-green">Status: Conforme</span>
      </div>
    </div>
  );
};
