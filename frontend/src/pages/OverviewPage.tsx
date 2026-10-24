import React from 'react';
import { TopKpiCards } from '../components/dashboard/TopKpiCards';
import { VibrationChart } from '../components/charts/VibrationChart';
import { TemperatureChart } from '../components/charts/TemperatureChart';
import { OeeGauge } from '../components/charts/OeeGauge';
import { EquipmentStatusTable } from '../components/dashboard/EquipmentStatusTable';
import { AiInsightsFeed } from '../components/dashboard/AiInsightsFeed';
import { telemetryService } from '../services/telemetryService';

export const OverviewPage: React.FC = () => {
  const summary = telemetryService.getSummary();

  return (
    <div className="w-full flex flex-col">
      {/* Top Cockpit Metrics Strip */}
      <TopKpiCards
        criticalCount={summary.critical_anomalies}
        alertCount={summary.active_alerts}
        avgMtbf={summary.avg_mtbf_hours}
      />

      {/* TOP ROW: Telemetry & KPIs */}
      <div className="grid grid-cols-12 gap-5 mb-6">
        {/* 1. Vibration Telemetry (5 cols on xl) */}
        <div className="col-span-12 xl:col-span-5">
          <VibrationChart />
        </div>

        {/* 2. Temperature Telemetry (4 cols on xl) */}
        <div className="col-span-12 md:col-span-7 xl:col-span-4">
          <TemperatureChart />
        </div>

        {/* 3. Global OEE Radial Gauge (3 cols on xl) */}
        <div className="col-span-12 md:col-span-5 xl:col-span-3">
          <OeeGauge oeeValue={summary.global_oee} />
        </div>
      </div>

      {/* BOTTOM ROW: Operational Matrix & Predictive AI Insights */}
      <div className="grid grid-cols-12 gap-5 mb-6">
        {/* 4. Equipment Status Matrix (8 cols on xl) */}
        <div className="col-span-12 xl:col-span-8">
          <EquipmentStatusTable />
        </div>

        {/* 5. AI Predictive Insights & Auto-OS (4 cols on xl) */}
        <div className="col-span-12 xl:col-span-4">
          <AiInsightsFeed />
        </div>
      </div>
    </div>
  );
};
