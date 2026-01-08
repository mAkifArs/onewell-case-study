// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STORE
// Manages project dashboard data (tables, operations, governance, lineage)
// Includes offline caching via localStorage
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

interface DashboardData {
  project: Project;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];
}

interface CachedDashboard {
  data: DashboardData;
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

  /** Dashboard data for current project */
  data: DashboardData | null;

  /** Cached dashboard data by project ID (for offline support) */
  cache: Record<string, CachedDashboard>;

  /** Loading state */
  isLoading: boolean;

  /** Global error message (e.g., project not found) */
  error: string | null;

  /** Per-section errors (allows partial rendering) */
  sectionErrors: SectionErrors;

  /** Load dashboard data for a project */
  loadDashboard: (projectId: string, forceRefresh?: boolean) => Promise<void>;

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
      data: null,
      cache: {},
      isLoading: false,
      error: null,
      sectionErrors: {},

      loadDashboard: async (projectId: string, forceRefresh = false) => {
        const state = get();

        // Skip if already loading this project
        if (state.isLoading && state.currentProjectId === projectId) return;

        const isOnline = navigator.onLine;
        const cachedData = state.cache[projectId];

        // If offline, use cached data
        if (!isOnline) {
          if (cachedData) {
            set({
              currentProjectId: projectId,
              data: cachedData.data,
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
            data: null,
            sectionErrors: {},
          });
          return;
        }

        // If data already loaded for this project and not forcing refresh
        if (
          !forceRefresh &&
          state.data &&
          state.currentProjectId === projectId
        ) {
          return;
        }

        set({
          isLoading: true,
          error: null,
          sectionErrors: {},
          currentProjectId: projectId,
        });

        // With Promise.allSettled, this won't throw - errors are in result.errors
        const result = await fetchProjectDashboardData(projectId);

        // Check if project itself failed (critical error)
        if (!result.project) {
          // Check cache as fallback
          if (cachedData) {
            set({
              data: cachedData.data,
              isLoading: false,
              error: "Project not found. Showing cached version.",
              sectionErrors: result.errors,
            });
            return;
          }
          set({
            error: result.errors.project ?? "Project not found",
            isLoading: false,
            data: null,
            sectionErrors: result.errors,
          });
          return;
        }

        const dashboardData: DashboardData = {
          project: result.project,
          tables: result.tables,
          operations: result.operations,
          governance: result.governance,
          lineage: result.lineage,
        };

        // Update cache (only cache successful data)
        const newCache = { ...state.cache };
        if (Object.keys(result.errors).length === 0) {
          // Only update cache if there were no errors
          newCache[projectId] = {
            data: dashboardData,
            cachedAt: Date.now(),
          };
        }

        set({
          data: dashboardData,
          isLoading: false,
          cache: newCache,
          sectionErrors: result.errors,
        });
      },

      clearDashboard: () =>
        set({
          currentProjectId: null,
          data: null,
          isLoading: false,
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
