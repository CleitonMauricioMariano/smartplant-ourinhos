import { create } from 'zustand';
import { ProductionLine, ShiftType, OperationalStatus } from '../types/smartplant';

export type TimeWindow = '24H' | '7D' | '30D';
export type AppTab = 'overview' | 'equipment' | 'telemetry' | 'ai-insights' | 'alerts' | 'about';

interface FilterState {
  // Navegação
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Filtros Globais
  selectedLine: string;
  setSelectedLine: (line: string) => void;

  selectedShift: string;
  setSelectedShift: (shift: string) => void;

  selectedStatus: string;
  setSelectedStatus: (status: string) => void;

  timeWindow: TimeWindow;
  setTimeWindow: (window: TimeWindow) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Equipamento em foco (no gráfico de vibração / telemetria)
  focusedMachineId: string;
  setFocusedMachineId: (id: string) => void;

  // Drawer de Inspeção Lateral
  inspectedEquipmentId: string | null;
  isDrawerOpen: boolean;
  openInspectionDrawer: (equipmentId: string) => void;
  closeInspectionDrawer: () => void;

  // Modal / Toast de Emissão de OS
  isAutoOSModalOpen: boolean;
  autoOSMachineId: string | null;
  openAutoOSModal: (machineId?: string) => void;
  closeAutoOSModal: () => void;

  // Toast Notificação
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedLine: 'all',
  setSelectedLine: (line) => set({ selectedLine: line }),

  selectedShift: 'all',
  setSelectedShift: (shift) => set({ selectedShift: shift }),

  selectedStatus: 'all',
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  timeWindow: '24H',
  setTimeWindow: (timeWindow) => set({ timeWindow }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  focusedMachineId: 'EQP-0215',
  setFocusedMachineId: (focusedMachineId) => set({ focusedMachineId }),

  inspectedEquipmentId: null,
  isDrawerOpen: false,
  openInspectionDrawer: (equipmentId) => set({ inspectedEquipmentId: equipmentId, isDrawerOpen: true }),
  closeInspectionDrawer: () => set({ isDrawerOpen: false }),

  isAutoOSModalOpen: false,
  autoOSMachineId: null,
  openAutoOSModal: (machineId) => set((state) => ({ 
    isAutoOSModalOpen: true, 
    autoOSMachineId: machineId || state.inspectedEquipmentId || 'EQP-0215' 
  })),
  closeAutoOSModal: () => set({ isAutoOSModalOpen: false }),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 5000);
  },
  clearToast: () => set({ toastMessage: null }),
}));
