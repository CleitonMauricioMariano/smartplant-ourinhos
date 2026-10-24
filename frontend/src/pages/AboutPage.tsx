import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-6 shadow-card-scada">
        <div className="flex items-center gap-2 text-neon-green font-mono text-[11px] mb-2">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>ARQUITETURA DE SISTEMAS &amp; FRAMEWORK DE IA</span>
        </div>
        <h1 className="text-[26px] font-bold text-text-primary">
          SmartPlant Ourinhos — Indústria 4.0 &amp; Telemetria IoT
        </h1>
        <p className="text-[14px] text-text-secondary mt-2 leading-relaxed">
          Plataforma de missão crítica inspirada em centros de comando SCADA modernos, integrando
          análise harmônica de vibração em mancais, sobrecarga térmica de servomotores e geração
          autônoma de Ordens de Serviço preditivas assistidas por Inteligência Artificial Generativa.
        </p>
      </div>

      {/* Subsystem Connection Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-[11px]">
        <div className="bg-bg-card backdrop-blur-md border border-neon-green/30 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-text-muted text-[10px] uppercase">Google Antigravity</span>
          <span className="text-neon-green font-bold text-[14px] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-green"></span>
            ORCHESTRATOR
          </span>
          <span className="text-text-secondary text-[10px] mt-0.5">3-Layer Arch Active</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-neon-green/30 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-text-muted text-[10px] uppercase">Google Stitch MCP</span>
          <span className="text-neon-green font-bold text-[14px] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-green"></span>
            SYNCHRONIZED
          </span>
          <span className="text-text-secondary text-[10px] mt-0.5">SCADA High-Fidelity</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-neon-green/30 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-text-muted text-[10px] uppercase">Gemini 3.8 Flash</span>
          <span className="text-neon-green font-bold text-[14px] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-green"></span>
            CMRP ENGINE
          </span>
          <span className="text-text-secondary text-[10px] mt-0.5">Structured Prescriptions</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-neon-green/30 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-text-muted text-[10px] uppercase">Data Hydration</span>
          <span className="text-neon-green font-bold text-[14px] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-green"></span>
            1.200 RECORDS
          </span>
          <span className="text-text-secondary text-[10px] mt-0.5">Zero Placeholders</span>
        </div>

        <div className="bg-bg-card backdrop-blur-md border border-cyber-blue/30 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-text-muted text-[10px] uppercase">Supply Chain Engine</span>
          <span className="text-cyber-blue font-bold text-[14px] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyber-blue"></span>
            SCRAPER ACTIVE
          </span>
          <span className="text-text-secondary text-[10px] mt-0.5">Cache-Aside + Fallback</span>
        </div>
      </div>

      {/* 3-Layer Architecture Overview */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-6 shadow-card-scada space-y-4">
        <h2 className="text-[18px] font-bold text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-neon-green">layers</span>
          Arquitetura Operacional de 3 Camadas (Google Antigravity)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px] pt-2">
          <div className="bg-surface-container-low p-4 rounded-xl border border-white/[0.05]">
            <div className="text-neon-green font-bold text-[13px] mb-1">Camada 1: Diretivas</div>
            <div className="text-[11px] text-text-muted mb-2">/directives/ (SOPs em Markdown)</div>
            <p className="text-text-secondary text-[11px] font-sans leading-relaxed">
              Define o &quot;O Quê&quot; e &quot;Por Quê&quot;. Especificações de engenharia, limites de vibração (3.8 e 6.0 mm/s),
              regras de negócio do OEE e diretrizes de confiabilidade CMRP.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-neon-green/30">
            <div className="text-neon-green font-bold text-[13px] mb-1">Camada 2: Orquestração</div>
            <div className="text-[11px] text-neon-green mb-2">Agente Inteligente Antigravity</div>
            <p className="text-text-secondary text-[11px] font-sans leading-relaxed">
              O &quot;Como&quot;. Interpreta diretivas, integra ferramentas MCP (Stitch, Firebase, GitHub),
              executa auto-recuperação (Self-Annealing) e garante tipo estrito TypeScript.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-white/[0.05]">
            <div className="text-neon-green font-bold text-[13px] mb-1">Camada 3: Execução</div>
            <div className="text-[11px] text-text-muted mb-2">/execution/ (Scripts Determinísticos)</div>
            <p className="text-text-secondary text-[11px] font-sans leading-relaxed">
              O &quot;Fazer&quot;. Scripts em Node.js de parsing de CSV, sincronização com Firestore, testes de conectividade
              e automação de publicação no GitHub.
            </p>
          </div>
        </div>
      </div>

      {/* Production Lines Topology */}
      <div className="bg-bg-card backdrop-blur-md border border-border-subtle rounded-xl p-6 shadow-card-scada space-y-4">
        <h2 className="text-[18px] font-bold text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-neon-green">factory</span>
          Topologia do Complexo Industrial Ourinhos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-[11px]">
          <div className="p-3 bg-surface-container-lowest rounded-lg border border-white/[0.05]">
            <div className="text-text-primary font-bold">Linha A</div>
            <div className="text-text-secondary text-[10px]">Envasamento</div>
            <div className="text-neon-green text-[10px] mt-2">● Enchedoras Krones, Lavadoras</div>
          </div>
          <div className="p-3 bg-surface-container-lowest rounded-lg border border-white/[0.05]">
            <div className="text-text-primary font-bold">Linha B</div>
            <div className="text-text-secondary text-[10px]">Rotulagem</div>
            <div className="text-text-secondary text-[10px] mt-2">Rotuladoras Sidel, Inkjet</div>
          </div>
          <div className="p-3 bg-surface-container-lowest rounded-lg border border-white/[0.05]">
            <div className="text-text-primary font-bold">Linha C</div>
            <div className="text-text-secondary text-[10px]">Embalagem</div>
            <div className="text-neon-crimson text-[10px] mt-2">▲ Paletizadores ABB, SEW R47</div>
          </div>
          <div className="p-3 bg-surface-container-lowest rounded-lg border border-white/[0.05]">
            <div className="text-text-primary font-bold">Linha D</div>
            <div className="text-text-secondary text-[10px]">Processamento Térmico</div>
            <div className="text-neon-orange text-[10px] mt-2">■ Pasteurizadores Alfa Laval</div>
          </div>
          <div className="p-3 bg-surface-container-lowest rounded-lg border border-white/[0.05]">
            <div className="text-text-primary font-bold">Linha E</div>
            <div className="text-text-secondary text-[10px]">Utilidades e Caldeira</div>
            <div className="text-cyber-blue text-[10px] mt-2">◆ Compressores Atlas, Chillers</div>
          </div>
        </div>
      </div>
    </div>
  );
};
