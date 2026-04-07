import { create } from "zustand";
import type { SLAConfig, SLABreachAlert, TransitionRule } from "@/types";
import client from "@/api/client";

interface WorkflowState {
  // SLA config (loaded once)
  slaConfig: SLAConfig[];
  slaConfigLoaded: boolean;
  loadSLAConfig: () => Promise<void>;

  // Transition rules (loaded once)
  transitionRules: TransitionRule[];
  transitionRulesLoaded: boolean;
  loadTransitionRules: () => Promise<void>;

  // Real-time breach alerts
  breachAlerts: SLABreachAlert[];
  setBreachAlerts: (alerts: SLABreachAlert[]) => void;
  addBreachAlert: (alert: SLABreachAlert) => void;
  dismissAlert: (id: string) => void;
  breachCount: number;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  slaConfig: [],
  slaConfigLoaded: false,
  loadSLAConfig: async () => {
    if (get().slaConfigLoaded) return;
    try {
      const { data } = await client.get<SLAConfig[]>("/sla-config/");
      set({ slaConfig: data, slaConfigLoaded: true });
    } catch {
      // SLA config is optional — continue with defaults
      set({ slaConfigLoaded: true });
    }
  },

  transitionRules: [],
  transitionRulesLoaded: false,
  loadTransitionRules: async () => {
    if (get().transitionRulesLoaded) return;
    try {
      const { data } = await client.get<TransitionRule[]>("/workflow/transitions/");
      set({ transitionRules: data, transitionRulesLoaded: true });
    } catch {
      set({ transitionRulesLoaded: true });
    }
  },

  breachAlerts: [],
  breachCount: 0,
  setBreachAlerts: (alerts) => set({ breachAlerts: alerts, breachCount: alerts.length }),
  addBreachAlert: (alert) =>
    set((state) => {
      const exists = state.breachAlerts.some((a) => a.id === alert.id);
      if (exists) return state;
      const next = [alert, ...state.breachAlerts];
      return { breachAlerts: next, breachCount: next.length };
    }),
  dismissAlert: (id) =>
    set((state) => {
      const next = state.breachAlerts.filter((a) => a.id !== id);
      return { breachAlerts: next, breachCount: next.length };
    }),
}));
