import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useFilterStore } from '../store/useFilterStore';
import { telemetryService } from '../services/telemetryService';

export const TelemetryPage: React.FC = () => {
  const { focusedMachineId, setFocusedMachineId, timeWindow, setTimeWindow } = useFilterStore();
  const allEquipments = telemetryService.getAllEquipments();
  const records = telemetryService.getTelemetryRecords(focusedMachineId);

  const limit = timeWindow === '24H' ? 24 : timeWindow === '7D' ? 60 : 120;
  const chartData = (records.length > 0 ? records.slice(-limit) : []).map((r, i) => ({
    time: r.timestamp.includes(' ') ? r.timestamp.split(' ')[1] : `${String(i).padStart(2, '0')}:00`,
    vibracao: r.sensor_vibracao_inboard_mm_s,
    temp: r.sensor_temp_c,
    pressao: r.pressao_psi,
    corrente: r.corrente_eletrica_amp,
    ruido: r.nivel_ruido_db,
    oee: r.eficiencia_oee_percent,
  }));

  const current = records.length > 0 ? records[records.length - 1] : undefined;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header & Machine Selector */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyber-blue font-mono text-[11px] mb-1">
            <span className="material-symbols-outlined text-[16px]">troubleshoot</span>
            <span>ANALISADOR MULTIVARIÁVEL SINCRONIZADO</span>
          </div>
          <h1 className="text-[22px] font-bold text-text-primary">Multi-Variable Telemetry Analyzer</h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Correlação em tempo real entre Vibração Harmônica, Assinatura Térmica, Pressão Pneumática, Carga Elétrica e Ruído Acústico.
          </p>
        </div>

        {/* Machine Selector & Time Window */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-muted uppercase">Máquina:</span>
            <select
              value={focusedMachineId}
              onChange={(e) => setFocusedMachineId(e.target.value)}
              className="h-9 bg-bg-primary border border-border-subtle rounded-lg px-3 font-mono text-[12px] text-text-primary focus:border-neon-green focus:outline-none"
            >
              {allEquipments.slice(0, 40).map((eq) => (
                <option key={eq.maquina_id} value={eq.maquina_id}>
                  {eq.maquina_id} — {eq.tipo_equipamento}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-bg-primary p-0.5 rounded-lg border border-border-subtle font-mono text-[11px]">
            {(['24H', '7D', '30D'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  timeWindow === w
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Readings Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
        <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-text-muted uppercase">Vibração RMS</span>
          <span className="text-[22px] font-bold text-neon-green tabular-nums">
            {(current?.sensor_vibracao_inboard_mm_s || 2.1).toFixed(2)}{' '}
            <span className="text-[12px] font-normal text-text-secondary">mm/s</span>
          </span>
          <span className="text-[10px] text-text-secondary mt-1">Limite: 3.8 mm/s</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-text-muted uppercase">Temperatura Carcaça</span>
          <span className="text-[22px] font-bold text-neon-orange tabular-nums">
            {(current?.sensor_temp_c || 74.2).toFixed(1)}{' '}
            <span className="text-[12px] font-normal text-text-secondary">°C</span>
          </span>
          <span className="text-[10px] text-text-secondary mt-1">Threshold: 80.0 °C</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-text-muted uppercase">Pressão de Linha</span>
          <span className="text-[22px] font-bold text-cyber-blue tabular-nums">
            {(current?.pressao_psi || 120.4).toFixed(1)}{' '}
            <span className="text-[12px] font-normal text-text-secondary">PSI</span>
          </span>
          <span className="text-[10px] text-text-secondary mt-1">Nominal: 110-130 PSI</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-text-muted uppercase">Corrente Elétrica</span>
          <span className="text-[22px] font-bold text-neon-amber tabular-nums">
            {(current?.corrente_eletrica_amp || 22.4).toFixed(1)}{' '}
            <span className="text-[12px] font-normal text-text-secondary">A</span>
          </span>
          <span className="text-[10px] text-text-secondary mt-1">Pico Máx: 30.0 A</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-text-muted uppercase">Nível de Ruído</span>
          <span className="text-[22px] font-bold text-text-primary tabular-nums">
            {(current?.nivel_ruido_db || 78.5).toFixed(1)}{' '}
            <span className="text-[12px] font-normal text-text-secondary">dB</span>
          </span>
          <span className="text-[10px] text-text-secondary mt-1">NR-15: 85.0 dB</span>
        </div>
      </div>

      {/* Main Multi-channel Sychronized Chart */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] mb-4">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
            Correlação Sincronizada das Grandezas Físicas ({focusedMachineId})
          </h2>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-neon-green">
              <span className="w-2.5 h-2.5 rounded-sm bg-neon-green"></span> Vibração (mm/s)
            </span>
            <span className="flex items-center gap-1.5 text-neon-orange">
              <span className="w-2.5 h-2.5 rounded-sm bg-neon-orange"></span> Temperatura (°C)
            </span>
            <span className="flex items-center gap-1.5 text-cyber-blue">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyber-blue"></span> Pressão (PSI)
            </span>
            <span className="flex items-center gap-1.5 text-neon-amber">
              <span className="w-2.5 h-2.5 rounded-sm bg-neon-amber"></span> Corrente (A)
            </span>
          </div>
        </div>

        <div className="w-full h-[360px] select-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis yAxisId="left" stroke="#64748B" fontSize={10} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={10} tickLine={false} fontFamily="JetBrains Mono" />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-bg-primary/95 border border-border-subtle rounded-lg p-3 shadow-xl backdrop-blur-md font-mono text-[11px]">
                        <div className="text-text-muted text-[10px] border-b border-white/10 pb-1 mb-2">
                          {label} — {focusedMachineId}
                        </div>
                        {payload.map((p, i) => (
                          <div key={i} className="flex justify-between gap-4 py-0.5" style={{ color: p.color }}>
                            <span>{p.name}:</span>
                            <span className="font-bold tabular-nums">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line yAxisId="left" type="monotone" dataKey="vibracao" name="Vibração (mm/s)" stroke="#00E676" strokeWidth={2.5} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperatura (°C)" stroke="#FF6D00" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="pressao" name="Pressão (PSI)" stroke="#2979FF" strokeWidth={1.8} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="corrente" name="Corrente (A)" stroke="#FFB300" strokeWidth={1.8} dot={false} strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
