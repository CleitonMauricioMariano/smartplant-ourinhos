import React from 'react';
import { useFilterStore } from './store/useFilterStore';
import { Navbar } from './components/layout/Navbar';
import { FilterBar } from './components/layout/FilterBar';
import { InspectionDrawer } from './components/layout/InspectionDrawer';
import { AutoOSModal } from './components/layout/AutoOSModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { AlertsCenterPage } from './pages/AlertsCenterPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  const { activeTab, toastMessage, clearToast } = useFilterStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'equipment':
        return <EquipmentPage />;
      case 'telemetry':
        return <TelemetryPage />;
      case 'ai-insights':
        return <AiInsightsPage />;
      case 'alerts':
        return <AlertsCenterPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="bg-bg-canvas text-text-primary min-h-screen flex flex-col font-sans selection:bg-neon-green/30 selection:text-neon-green">
      {/* 1. Fixed SCADA Header */}
      <Navbar />

      {/* 2. Fixed SCADA Quick Filter Bar */}
      <FilterBar />

      {/* 3. Main Dashboard Viewport */}
      <main className="w-full pt-[116px] flex-1 pb-10">
        <div className="max-w-[1600px] mx-auto px-6 w-full">
          {renderActiveTab()}
        </div>
      </main>

      {/* 4. SCADA Technical Footer */}
      <footer className="w-full bg-bg-primary border-t border-border-subtle py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-text-muted">
          <div>SMARTPLANT SCADA CORE v4.2.0 • COMPLEXO INDUSTRIAL OURINHOS</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neon-green">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
              SLA 99.98%
            </span>
            <span>LATENCY: 14ms</span>
            <span>SECURE TLS 1.3</span>
          </div>
        </div>
      </footer>

      {/* 5. Inspection Slide-in Drawer */}
      <InspectionDrawer />

      {/* 6. Predictive Work Order Modal */}
      <AutoOSModal />

      {/* 7. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B0E14] border border-neon-green/50 text-text-primary p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center text-neon-green shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <div className="font-mono text-[12px] font-bold text-neon-green">OPERAÇÃO CONCLUÍDA!</div>
            <div className="text-[12px] text-text-secondary">{toastMessage}</div>
          </div>
          <button onClick={clearToast} className="ml-3 text-text-muted hover:text-text-primary">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
