// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STORE
// Manages project dashboard data with granular state for each section
// Each panel can select only what it needs - no prop drilling!
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";
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

interface CachedDashboard {
  project: Project;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];
  cachedAt: number;
}

/** Per-section error tracking for graceful degradation */
interface SectionErrors {
  project?: string;
  tables?: string;
  operations?: string;
  governance?: string;
  lineage?: string;
}

interface DashboardState {
  /** Current project ID being viewed */
  currentProjectId: string | null;

  /** Individual data sections - each panel selects only what it needs */
  project: Project | null;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];

  /** Cached dashboard data by project ID (for offline support) */
  cache: Record<string, CachedDashboard>;

  /** Loading state */
  isLoading: boolean;

  /** Global error message (e.g., project not found) */
  error: string | null;

  /** Per-section errors (allows partial rendering) */
  sectionErrors: SectionErrors;

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

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      currentProjectId: null,
      project: null,
      tables: [],
      operations: [],
      governance: null,
      lineage: [],
      cache: {},
      isLoading: true, // Start with loading true
      error: null,
      sectionErrors: {},

      loadDashboard: async (projectId: string) => {
        const state = get();

        // Skip if already loaded for this project
        if (state.project && state.currentProjectId === projectId) return;

        const isOnline = navigator.onLine;
        const cachedData = state.cache[projectId];

        // If offline, use cached data
        if (!isOnline) {
          if (cachedData) {
            set({
              currentProjectId: projectId,
              project: cachedData.project,
              tables: cachedData.tables,
              operations: cachedData.operations,
              governance: cachedData.governance,
              lineage: cachedData.lineage,
              isLoading: false,
              error: null,
              sectionErrors: {},
            });
            return;
          }
          // No cached data and offline
          set({
            currentProjectId: projectId,
            error: "No internet connection and no cached data for this project",
            isLoading: false,
            project: null,
            tables: [],
            operations: [],
            governance: null,
            lineage: [],
            sectionErrors: {},
          });
          return;
        }

        set({
          currentProjectId: projectId,
        });

        // With Promise.allSettled, this won't throw - errors are in result.errors
        const result = await fetchProjectDashboardData(projectId);

        // Check if project itself failed (critical error)
        if (!result.project) {
          // Check cache as fallback
          if (cachedData) {
            set({
              project: cachedData.project,
              tables: cachedData.tables,
              operations: cachedData.operations,
              governance: cachedData.governance,
              lineage: cachedData.lineage,
              isLoading: false,
              error: "Project not found. Showing cached version.",
              sectionErrors: result.errors,
            });
            return;
          }
          set({
            error: result.errors.project ?? "Project not found",
            isLoading: false,
            project: null,
            tables: [],
            operations: [],
            governance: null,
            lineage: [],
            sectionErrors: result.errors,
          });
          return;
        }

        // Update cache (only cache successful data)
        const newCache = { ...state.cache };
        if (Object.keys(result.errors).length === 0) {
          newCache[projectId] = {
            project: result.project,
            tables: result.tables,
            operations: result.operations,
            governance: result.governance,
            lineage: result.lineage,
            cachedAt: Date.now(),
          };
        }

        set({
          project: result.project,
          tables: result.tables,
          operations: result.operations,
          governance: result.governance,
          lineage: result.lineage,
          isLoading: false,
          cache: newCache,
          sectionErrors: result.errors,
        });
      },

      clearDashboard: () =>
        set({
          currentProjectId: null,
          project: null,
          tables: [],
          operations: [],
          governance: null,
          lineage: [],
          isLoading: true, // Reset to loading for next project
          error: null,
          sectionErrors: {},
        }),

      clearError: () => set({ error: null, sectionErrors: {} }),
    }),
    {
      name: "onewell-dashboard",
      // Persist cache for offline support
      partialize: (state) => ({
        cache: state.cache,
      }),
    }
  )
);
