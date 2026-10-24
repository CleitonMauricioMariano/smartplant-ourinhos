import React, { useState, useEffect } from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { telemetryService } from '../../services/telemetryService';
import { requestGeminiDiagnosis, GeminiDiagnosisResponse } from '../../services/geminiService';
import { WorkOrder } from '../../types/smartplant';

export const AutoOSModal: React.FC = () => {
  const { isAutoOSModalOpen, autoOSMachineId, closeAutoOSModal, showToast } = useFilterStore();
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<GeminiDiagnosisResponse | null>(null);

  const eq = autoOSMachineId ? telemetryService.getEquipmentById(autoOSMachineId) : undefined;

  useEffect(() => {
    if (isAutoOSModalOpen && eq) {
      setLoading(true);
      requestGeminiDiagnosis(
        eq.maquina_id,
        eq.tipo_equipamento,
        eq.componente_critico,
        eq.codigo_peca_reposicao,
        eq.fornecedor_homologado,
        eq.vibracao_atual || 5.82,
        eq.temp_atual || 84.6,
        27.3,
        83.7
      ).then((res) => {
        setDiagnosis(res);
        setLoading(false);
      });
    }
  }, [isAutoOSModalOpen, autoOSMachineId]);

  if (!isAutoOSModalOpen || !eq) return null;

  const handleEmitOS = () => {
    const osId = `OS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newWo: WorkOrder = {
      os_id: osId,
      maquina_id: eq.maquina_id,
      tipo: 'preditiva',
      prioridade: diagnosis?.prioridade_sugerida || 'critica',
      componente: eq.componente_critico,
      peca_codigo: eq.codigo_peca_reposicao,
      custo_estimado_csv: eq.custo_estimado_r$,
      preco_cotado_atual: Math.round(eq.custo_estimado_r$ * 0.94),
      fornecedor_cotado: eq.fornecedor_homologado,
      fonte_preco: 'live_scraping',
      lead_time_dias: eq.lead_time_dias,
      compra_antecipada: eq.compra_antecipada_flag,
      diagnostico_ia: diagnosis?.diagnostico_ia || eq.diagnostico_recente || 'Intervenção prescritiva recomendada.',
      acao_recomendada: diagnosis?.acao_recomendada || [
        'Bloqueio LOTO.',
        'Inspeção do mancal.',
        'Troca da peça sobressalente.'
      ],
      status: 'aberta',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    telemetryService.createWorkOrder(newWo);
    closeAutoOSModal();
    showToast(`ORDEM DE SERVIÇO #${osId} DESPACHADA COM SUCESSO!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={closeAutoOSModal}></div>

      {/* Modal Dialog */}
      <div className="relative bg-[#0B0E14] border border-neon-green/40 rounded-xl shadow-2xl w-full max-w-lg p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-neon-green/15 border border-neon-green/40 flex items-center justify-center text-neon-green shadow-[0_0_12px_rgba(0,230,118,0.3)]">
              <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-text-primary">
                Emissão de OS Preditiva Automatizada
              </h3>
              <div className="font-mono text-[11px] text-neon-green">
                ATIVO: {eq.maquina_id} • {eq.tipo_equipamento}
              </div>
            </div>
          </div>
          <button
            onClick={closeAutoOSModal}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-neon-green animate-spin">
              progress_activity
            </span>
            <span className="font-mono text-[12px] text-text-secondary animate-pulse">
              Consultando modelo Gemini 3.8 Flash e catálogo de fornecedores...
            </span>
          </div>
        ) : (
          <div className="mt-4 space-y-3 font-mono text-[12px]">
            {/* Diagnosis Callout */}
            <div className="bg-surface-container-low p-3.5 rounded-lg border border-border-subtle">
              <div className="flex justify-between text-[11px] mb-1.5 text-text-muted">
                <span>DIAGNÓSTICO TÉCNICO CMRP</span>
                <span className="text-neon-green font-semibold">
                  Modelo: {diagnosis?.fonte || 'gemini-3.8-flash'}
                </span>
              </div>
              <p className="text-text-primary leading-relaxed text-[12px]">
                {diagnosis?.diagnostico_ia}
              </p>
            </div>

            {/* Causa Raiz */}
            <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] text-text-muted uppercase block mb-1">
                Causa Raiz Provável:
              </span>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                {diagnosis?.causa_raiz_provavel}
              </p>
            </div>

            {/* Prescriptive Steps */}
            <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] text-neon-green uppercase block mb-1 font-semibold">
                Passos Prescritivos de Intervenção:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-text-secondary text-[11px]">
                {diagnosis?.acao_recomendada.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Financial and Supply Chain Summary */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-surface-container-lowest p-2.5 rounded border border-white/[0.04]">
                <span className="text-text-muted block text-[10px]">Cotação Scraping</span>
                <span className="text-neon-green font-bold text-[13px]">
                  R$ {(eq.custo_estimado_r$ * 0.94).toFixed(2)}
                </span>
                <span className="text-[10px] text-text-secondary block mt-0.5">{eq.fornecedor_homologado}</span>
              </div>

              <div className="bg-surface-container-lowest p-2.5 rounded border border-white/[0.04]">
                <span className="text-text-muted block text-[10px]">Lead Time Fornecedor</span>
                <span className={`font-bold text-[13px] ${eq.lead_time_dias > 5 ? 'text-neon-crimson' : 'text-text-primary'}`}>
                  {eq.lead_time_dias} dias úteis
                </span>
                <span className="text-[10px] text-neon-amber block mt-0.5">
                  {eq.lead_time_dias > 5 ? 'COMPRA ANTECIPADA' : 'Estoque Regular'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3 font-mono text-[12px]">
          <button
            onClick={closeAutoOSModal}
            className="px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleEmitOS}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-neon-green hover:bg-neon-green/90 text-bg-canvas font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,230,118,0.35)] transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Despachar OS Preditiva
          </button>
        </div>
      </div>
    </div>
  );
};
