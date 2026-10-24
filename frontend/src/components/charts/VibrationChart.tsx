import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useFilterStore } from '../../store/useFilterStore';
import { telemetryService } from '../../services/telemetryService';

export const VibrationChart: React.FC = () => {
  const { focusedMachineId, timeWindow, setTimeWindow } = useFilterStore();
  const data = telemetryService.getVibrationTimeSeries(focusedMachineId, timeWindow);

  // Calcular métricas rápidas
  const maxInboard = Math.max(...data.map((d) => d.inboard), 0);
  const avgInboard = data.reduce((a, b) => a + b.inboard, 0) / (data.length || 1);

  return (
    <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-neon-green/5 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        {/* Header & Timeline Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neon-green text-[18px]">graphic_eq</span>
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
              Vibration Telemetry (mm/s)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-bg-primary/90 p-0.5 rounded-lg border border-border-subtle font-mono text-[11px]">
              {(['24H', '7D', '30D'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setTimeWindow(w)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeWindow === w
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 font-semibold shadow-[0_0_8px_rgba(0,230,118,0.25)]'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Series Legend & Sensor ID */}
        <div className="flex items-center justify-between pt-3 pb-2 text-[11px] font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-sm bg-neon-green shadow-[0_0_6px_#00E676]"></span>
              Inboard Bearings
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyber-blue shadow-[0_0_6px_#2979FF]"></span>
              Outboard Bearings
            </span>
          </div>
          <span className="text-neon-crimson font-semibold">ATIVO: {focusedMachineId}</span>
        </div>

        {/* Chart View */}
        <div className="w-full h-[220px] mt-2 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="vibGreenArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E676" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#00E676" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="vibBlueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2979FF" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2979FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                domain={[0, 8]}
                fontFamily="JetBrains Mono"
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const inb = payload.find((p) => p.dataKey === 'inboard')?.value;
                    const outb = payload.find((p) => p.dataKey === 'outboard')?.value;
                    return (
                      <div className="bg-bg-primary/95 border border-border-subtle rounded-lg p-2.5 shadow-xl backdrop-blur-md font-mono text-[11px]">
                        <div className="text-neon-green border-b border-white/10 pb-1 mb-1.5 flex justify-between gap-3 text-[10px]">
                          <span>
                            {label} — {focusedMachineId}
                          </span>
                          <span className="bg-neon-crimson/20 text-neon-crimson px-1 rounded">
                            PEAK HARMONIC
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between gap-4 text-neon-green">
                            <span>Inboard:</span>
                            <span className="font-bold tabular-nums">{inb} mm/s</span>
                          </div>
                          <div className="flex justify-between gap-4 text-cyber-blue">
                            <span>Outboard:</span>
                            <span className="font-bold tabular-nums">{outb} mm/s</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine
                y={6.0}
                stroke="#FF1744"
                strokeDasharray="4 4"
                label={{
                  value: 'CRÍTICO 6.0 mm/s',
                  fill: '#FF1744',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <ReferenceLine
                y={3.8}
                stroke="#FFB300"
                strokeDasharray="4 4"
                label={{
                  value: 'ALERTA 3.8 mm/s',
                  fill: '#FFB300',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'JetBrains Mono',
                }}
              />

              {/* Outboard Series */}
              <Area
                type="monotone"
                dataKey="outboard"
                fill="url(#vibBlueArea)"
                stroke="#2979FF"
                strokeWidth={2}
              />

              {/* Inboard Series */}
              <Area
                type="monotone"
                dataKey="inboard"
                fill="url(#vibGreenArea)"
                stroke="#00E676"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#00E676' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Badges Footer */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/[0.05] font-mono">
        <div className="bg-surface-container-low/80 p-2 rounded border border-border-subtle flex flex-col">
          <span className="text-[10px] text-text-muted uppercase">Max Peak</span>
          <span className="text-neon-crimson font-bold text-[13px] tabular-nums">
            {maxInboard.toFixed(2)} mm/s
          </span>
        </div>
        <div className="bg-surface-container-low/80 p-2 rounded border border-border-subtle flex flex-col">
          <span className="text-[10px] text-text-muted uppercase">Avg ({timeWindow})</span>
          <span className="text-text-primary font-bold text-[13px] tabular-nums">
            {avgInboard.toFixed(2)} mm/s
          </span>
        </div>
        <div className="bg-surface-container-low/80 p-2 rounded border border-border-subtle flex flex-col">
          <span className="text-[10px] text-text-muted uppercase">Harmonics</span>
          <span className="text-neon-amber font-bold text-[13px]">
            {maxInboard > 3.8 ? 'Instável 2X' : 'Nominal 1X'}
          </span>
        </div>
      </div>
    </div>
  );
};
