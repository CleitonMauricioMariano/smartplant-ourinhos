import React from 'react';
import { useFilterStore, AppTab } from '../../store/useFilterStore';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useFilterStore();

  const tabs: { id: AppTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'telemetry', label: 'Telemetry' },
    { id: 'ai-insights', label: 'AI Insights' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle">
      <div className="h-14 w-full px-6 max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Plant Identifier */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="h-8 w-8 rounded-lg bg-neon-green/10 border border-neon-green/40 flex items-center justify-center text-neon-green shadow-[0_0_12px_rgba(0,230,118,0.3)]">
            <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold text-text-primary tracking-tight">SmartPlant</span>
            <span className="font-mono text-[11px] text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded tracking-wider">
              OURINHOS
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-6 h-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 px-1 ${
                  isActive
                    ? 'text-neon-green border-neon-green drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]'
                    : 'text-text-secondary hover:text-text-primary border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Indicator & Operator Badge */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-text-secondary bg-surface-container-low px-2.5 py-1 rounded border border-border-subtle">
            <span className="material-symbols-outlined text-[14px] text-neon-green animate-pulse">sensors</span>
            <span>PLANT-ID: 04-SP</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden md:flex flex-col text-left font-mono">
              <span className="text-[11px] text-text-primary font-semibold leading-tight">Eng. Confiabilidade</span>
              <span className="text-[9px] text-neon-green leading-none">CMRP Level III</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
