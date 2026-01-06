// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STORE
// Manages project dashboard data (tables, operations, governance, lineage)
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import type {
  Project,
  ProjectTable,
  Operation,
  Governance,
  LineageRelation,
} from "@/types";
import { fetchProjectDashboardData } from "@/services";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface DashboardData {
  project: Project;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];
}

interface DashboardState {
  /** Current project ID being viewed */
  currentProjectId: string | null;

  /** Dashboard data for current project */
  data: DashboardData | null;

  /** Loading state */
  isLoading: boolean;

  /** Error message if fetch failed */
  error: string | null;

  /** Load dashboard data for a project */
  loadDashboard: (projectId: string) => Promise<void>;

  /** Clear dashboard data */
  clearDashboard: () => void;

  /** Clear error state */
  clearError: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentProjectId: null,
  data: null,
  isLoading: false,
  error: null,

  loadDashboard: async (projectId: string) => {
    const state = get();

    // Skip if already loading this project
    if (state.isLoading && state.currentProjectId === projectId) return;

    // Skip if data already loaded for this project
    if (state.data && state.currentProjectId === projectId) return;

    set({ isLoading: true, error: null, currentProjectId: projectId });

    try {
      const result = await fetchProjectDashboardData(projectId);

      if (!result.project) {
        set({
          error: "Project not found",
          isLoading: false,
          data: null,
        });
        return;
      }

      set({
        data: {
          project: result.project,
          tables: result.tables,
          operations: result.operations,
          governance: result.governance,
          lineage: result.lineage,
        },
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load project",
        isLoading: false,
        data: null,
      });
    }
  },

  clearDashboard: () =>
    set({
      currentProjectId: null,
      data: null,
      isLoading: false,
      error: null,
    }),

  clearError: () => set({ error: null }),
}));
