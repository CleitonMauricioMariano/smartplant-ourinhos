import seedData from '../data/seedFallback.json';
import { Equipment, TelemetryRecord, WorkOrder, PlantSummary, PlantDataPayload } from '../types/smartplant';

const data: PlantDataPayload = seedData as unknown as PlantDataPayload;

// Armazenamento mutável em memória para simulação interativa viva
let currentWorkOrders: WorkOrder[] = [...data.workOrders];

export const telemetryService = {
  getSummary(): PlantSummary {
    return data.summary;
  },

  getAllEquipments(): Equipment[] {
    return data.equipments;
  },

  getEquipmentById(id: string): Equipment | undefined {
    return data.equipments.find((e) => e.maquina_id.toLowerCase() === id.toLowerCase());
  },

  getFilteredEquipments(line: string, shift: string, status: string, query: string): Equipment[] {
    return data.equipments.filter((eq) => {
      const matchLine = line === 'all' || eq.linha_producao.toLowerCase().includes(line.toLowerCase());
      const matchStatus = status === 'all' || eq.status_atual === status;
      const matchQuery =
        !query ||
        eq.maquina_id.toLowerCase().includes(query.toLowerCase()) ||
        eq.tipo_equipamento.toLowerCase().includes(query.toLowerCase()) ||
        eq.componente_critico.toLowerCase().includes(query.toLowerCase()) ||
        eq.linha_producao.toLowerCase().includes(query.toLowerCase());

      return matchLine && matchStatus && matchQuery;
    });
  },

  getTelemetryRecords(machineId?: string): TelemetryRecord[] {
    if (!machineId) return data.telemetry;
    return data.telemetry.filter((t) => t.maquina_id.toLowerCase() === machineId.toLowerCase());
  },

  getVibrationTimeSeries(machineId: string, window: '24H' | '7D' | '30D') {
    const records = this.getTelemetryRecords(machineId);
    const limit = window === '24H' ? 24 : window === '7D' ? 70 : 120;
    const slice = records.length > 0 ? records.slice(-limit) : data.telemetry.slice(0, 24);

    return slice.map((r, idx) => ({
      time: r.timestamp.includes(' ') ? r.timestamp.split(' ')[1] : `${String(idx).padStart(2, '0')}:00`,
      inboard: r.sensor_vibracao_inboard_mm_s,
      outboard: r.sensor_vibracao_outboard_mm_s,
      warningLimit: 3.8,
      criticalLimit: 6.0,
      timestamp: r.timestamp,
    }));
  },

  getTemperatureTimeSeries(machineId: string) {
    const records = this.getTelemetryRecords(machineId);
    const slice = records.length > 0 ? records.slice(-24) : data.telemetry.slice(0, 24);

    return slice.map((r, idx) => ({
      time: r.timestamp.includes(' ') ? r.timestamp.split(' ')[1] : `${String(idx).padStart(2, '0')}:00`,
      temp: r.sensor_temp_c,
      threshold: 80,
      timestamp: r.timestamp,
    }));
  },

  getWorkOrders(): WorkOrder[] {
    return currentWorkOrders;
  },

  createWorkOrder(newWo: WorkOrder): WorkOrder {
    currentWorkOrders = [newWo, ...currentWorkOrders];
    return newWo;
  },

  updateWorkOrderStatus(osId: string, status: 'aberta' | 'em_andamento' | 'concluida'): void {
    currentWorkOrders = currentWorkOrders.map((wo) =>
      wo.os_id === osId ? { ...wo, status } : wo
    );
  },

  getAlertsList() {
    return data.equipments
      .filter((e) => e.status_atual !== 'Operando Normal')
      .map((e) => ({
        id: e.maquina_id,
        tipo: e.status_atual,
        equipamento: e.tipo_equipamento,
        linha: e.linha_producao,
        componente: e.componente_critico,
        vibracao: e.vibracao_atual || 4.2,
        temperatura: e.temp_atual || 82.5,
        risco: e.risco_parada_percent,
        compraAntecipada: e.compra_antecipada_flag,
        leadTime: e.lead_time_dias,
        timestamp: e.updated_at,
        diagnostico: e.diagnostico_recente,
      }));
  },
};
