import React, { useState } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { telemetryService } from '../services/telemetryService';
import { WorkOrder } from '../types/smartplant';

export const AiInsightsPage: React.FC = () => {
  const { openAutoOSModal, showToast } = useFilterStore();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const workOrders = telemetryService.getWorkOrders();

  const filteredOrders = workOrders.filter((wo) => {
    const matchPri = priorityFilter === 'all' || wo.prioridade === priorityFilter;
    const matchStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchPri && matchStatus;
  });

  const handleUpdateStatus = (osId: string, newStatus: 'aberta' | 'em_andamento' | 'concluida') => {
    telemetryService.updateWorkOrderStatus(osId, newStatus);
    showToast(`Status da OS #${osId} atualizado para: ${newStatus.toUpperCase()}`);
  };

  const criticalOrders = workOrders.filter((w) => w.prioridade === 'critica').length;
  const inProgressOrders = workOrders.filter((w) => w.status === 'em_andamento').length;
  const completedOrders = workOrders.filter((w) => w.status === 'concluida').length;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-card-scada flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neon-green font-mono text-[11px] mb-1">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>CENTRAL DE ORDENS DE SERVIÇO PREDITIVAS (GEMINI AI)</span>
          </div>
          <h1 className="text-[22px] font-bold text-text-primary">Predictive Work Orders Dispatch</h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Gestão prescritiva de intervenções mecânicas, cotações em tempo real via Web Scraper e compras antecipadas.
          </p>
        </div>

        <button
          onClick={() => openAutoOSModal()}
          className="bg-neon-green hover:bg-neon-green/90 text-bg-canvas font-mono text-[12px] font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
          Nova OS Preditiva
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[11px]">
        <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-4 flex flex-col">
          <span className="text-text-muted text-[10px] uppercase">TOTAL DE OS PREDITIVAS</span>
          <span className="text-[24px] font-bold text-text-primary mt-1">{workOrders.length}</span>
          <span className="text-text-secondary text-[10px] mt-0.5">Geradas por Regras + IA</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-neon-crimson/30 rounded-xl p-4 flex flex-col">
          <span className="text-neon-crimson text-[10px] uppercase">PRIORIDADE CRÍTICA</span>
          <span className="text-[24px] font-bold text-neon-crimson mt-1">{criticalOrders}</span>
          <span className="text-neon-crimson text-[10px] mt-0.5">Parada Iminente</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-neon-amber/30 rounded-xl p-4 flex flex-col">
          <span className="text-neon-amber text-[10px] uppercase">EM ANDAMENTO</span>
          <span className="text-[24px] font-bold text-neon-amber mt-1">{inProgressOrders}</span>
          <span className="text-text-secondary text-[10px] mt-0.5">Equipe em Campo</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-neon-green/30 rounded-xl p-4 flex flex-col">
          <span className="text-neon-green text-[10px] uppercase">CONCLUÍDAS</span>
          <span className="text-[24px] font-bold text-neon-green mt-1">{completedOrders}</span>
          <span className="text-neon-green text-[10px] mt-0.5">Ativos Reabilitados</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-card backdrop-blur-md border border-border-subtle p-3 rounded-xl font-mono text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted uppercase">Prioridade:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-bg-primary border border-border-subtle rounded px-2.5 py-1 text-text-primary focus:border-neon-green focus:outline-none"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-text-muted uppercase">Status OS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-bg-primary border border-border-subtle rounded px-2.5 py-1 text-text-primary focus:border-neon-green focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="aberta">Aberta</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        </div>

        <span className="text-text-muted">
          Mostrando {filteredOrders.length} ordens de serviço
        </span>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((wo) => {
          const isCritical = wo.prioridade === 'critica';
          const isDone = wo.status === 'concluida';

          const cardBorder = isDone
            ? 'border-white/10 opacity-70'
            : isCritical
            ? 'border-l-4 border-l-neon-crimson border-y border-r border-white/[0.08]'
            : 'border-l-4 border-l-neon-amber border-y border-r border-white/[0.08]';

          return (
            <div
              key={wo.os_id}
              className={`bg-bg-card backdrop-blur-md rounded-xl p-5 shadow-card-scada transition-all ${cardBorder}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] font-bold text-text-primary bg-bg-primary px-2.5 py-1 rounded border border-border-subtle">
                    {wo.os_id}
                  </span>
                  <div>
                    <span className="font-mono text-[12px] font-bold text-neon-green">
                      {wo.maquina_id}
                    </span>
                    <span className="text-text-muted text-[12px] ml-2 font-mono">• {wo.componente}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold border ${
                      isCritical
                        ? 'bg-neon-crimson/15 text-neon-crimson border-neon-crimson/40'
                        : 'bg-neon-amber/15 text-neon-amber border-neon-amber/40'
                    }`}
                  >
                    PRIORIDADE {wo.prioridade.toUpperCase()}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded font-semibold border ${
                      wo.status === 'concluida'
                        ? 'bg-neon-green/15 text-neon-green border-neon-green/40'
                        : wo.status === 'em_andamento'
                        ? 'bg-cyber-blue/15 text-cyber-blue border-cyber-blue/40'
                        : 'bg-white/10 text-text-primary border-white/20'
                    }`}
                  >
                    STATUS: {wo.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Diagnosis and Steps */}
              <div className="mt-3 text-[12px] space-y-2">
                <p className="text-text-primary leading-relaxed font-sans">{wo.diagnostico_ia}</p>

                <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle font-mono text-[11px]">
                  <span className="text-neon-green uppercase tracking-wider block mb-1">
                    Passos Prescritivos Recomendados:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary">
                    {wo.acao_recomendada.map((acao, i) => (
                      <li key={i}>{acao}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Financial Comparison & Scraping */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/[0.05] font-mono text-[11px]">
                <div className="bg-surface-container-lowest p-2.5 rounded border border-white/[0.04]">
                  <span className="text-[10px] text-text-muted block">Custo Estimado (CSV)</span>
                  <span className="text-[13px] font-bold text-text-primary tabular-nums">
                    R$ {wo.custo_estimado_csv.toFixed(2)}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-2.5 rounded border border-neon-green/20">
                  <span className="text-[10px] text-neon-green block">Cotação Atual (Live Scraping)</span>
                  <span className="text-[13px] font-bold text-neon-green tabular-nums">
                    R$ {(wo.preco_cotado_atual || wo.custo_estimado_csv * 0.94).toFixed(2)}
                  </span>
                  <span className="text-[9px] text-text-secondary block mt-0.5 truncate">
                    Fornecedor: {wo.fornecedor_cotado}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-2.5 rounded border border-white/[0.04]">
                  <span className="text-[10px] text-text-muted block">Lead Time &amp; Suprimentos</span>
                  <span
                    className={`text-[13px] font-bold ${
                      wo.lead_time_dias > 5 ? 'text-neon-crimson' : 'text-text-primary'
                    }`}
                  >
                    {wo.lead_time_dias} dias úteis
                  </span>
                  <span className="text-[9px] text-neon-amber block mt-0.5">
                    {wo.compra_antecipada ? 'COMPRA ANTECIPADA REQUERIDA' : 'Estoque Disponível'}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="mt-4 pt-3 flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted text-[10px]">Aberta em: {wo.created_at}</span>
                <div className="flex items-center gap-2">
                  {wo.status === 'aberta' && (
                    <button
                      onClick={() => handleUpdateStatus(wo.os_id, 'em_andamento')}
                      className="px-3 py-1 bg-cyber-blue/20 hover:bg-cyber-blue text-cyber-blue hover:text-bg-canvas border border-cyber-blue/40 rounded transition-all font-semibold"
                    >
                      Iniciar Atendimento
                    </button>
                  )}
                  {wo.status !== 'concluida' && (
                    <button
                      onClick={() => handleUpdateStatus(wo.os_id, 'concluida')}
                      className="px-3 py-1 bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-bg-canvas border border-neon-green/40 rounded transition-all font-semibold"
                    >
                      Finalizar OS
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
