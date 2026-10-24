import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useFilterStore } from '../../store/useFilterStore';
import { telemetryService } from '../../services/telemetryService';

export const TemperatureChart: React.FC = () => {
  const { focusedMachineId } = useFilterStore();
  const data = telemetryService.getTemperatureTimeSeries(focusedMachineId);

  const currentTemp = data.length > 0 ? data[data.length - 1].temp : 84.6;
  const isHigh = currentTemp > 80;

  return (
    <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col justify-between relative overflow-hidden">
      {/* Ambient Thermal Glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-neon-crimson/10 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-neon-orange text-[18px]">
                device_thermostat
              </span>
              <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
                Temperature Telemetry (°C)
              </h2>
            </div>
            <div className="font-mono text-[11px] text-text-muted mt-0.5">
              ATIVO: <span className="text-text-primary font-semibold">{focusedMachineId}</span>
            </div>
          </div>

          <span
            className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${
              isHigh
                ? 'border-neon-crimson/50 bg-neon-crimson/15 text-neon-crimson shadow-[0_0_12px_rgba(255,23,68,0.25)]'
                : 'border-neon-green/40 bg-neon-green/10 text-neon-green'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isHigh ? 'bg-neon-crimson animate-ping' : 'bg-neon-green'
              }`}
            ></span>
            {currentTemp.toFixed(1)}°C {isHigh ? 'ELEVADA' : 'NOMINAL'}
          </span>
        </div>

        {/* Big Metric Callout with Trend Context */}
        <div className="my-3 flex items-baseline justify-between bg-surface-container-low/60 p-3 rounded-lg border border-border-subtle">
          <div>
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Carcaça Principal
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-mono text-[32px] font-bold tracking-tight tabular-nums ${
                  isHigh ? 'text-neon-crimson' : 'text-neon-green'
                }`}
              >
                {currentTemp.toFixed(1)}
              </span>
              <span className="font-mono text-[16px] text-text-secondary">°C</span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="inline-flex items-center text-neon-crimson text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span> +6.2°C
            </span>
            <div className="text-[10px] text-text-muted">vs. Turno Anterior</div>
            <div className="text-[10px] text-neon-amber mt-0.5">ΔT crítico +14.6°C/amb</div>
          </div>
        </div>

        {/* Thermal Area Graph */}
        <div className="w-full h-[150px] select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="thermalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF1744" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#FF6D00" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#FF1744" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[50, 100]} fontFamily="JetBrains Mono" />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val = payload[0].value;
                    return (
                      <div className="bg-bg-primary/95 border border-border-subtle rounded p-2 text-[11px] font-mono shadow-xl backdrop-blur-md">
                        <div className="text-text-muted text-[10px]">{label}</div>
                        <div className="text-neon-crimson font-bold tabular-nums">Temp: {val}°C</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine
                y={80}
                stroke="#FFB300"
                strokeDasharray="3 3"
                label={{
                  value: 'THRESHOLD 80°C',
                  fill: '#FFB300',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'JetBrains Mono',
                }}
              />

              <Area
                type="monotone"
                dataKey="temp"
                fill="url(#thermalGrad)"
                stroke="#FF5252"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#FF5252' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-text-secondary">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-neon-crimson">
            thermostat_auto
          </span>
          Termografia FLIR: Hotspot ativo
        </span>
        <span className="text-neon-amber">Max: 86.1°C @ 21:40</span>
      </div>
    </div>
  );
};
