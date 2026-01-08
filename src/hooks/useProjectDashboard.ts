// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD HOOKS
// Granular hooks for each dashboard section - each component selects only what
// it needs, preventing unnecessary re-renders across the dashboard
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useDashboardStore } from "@/store";
import { groupOperationsByDate } from "@/utils/operationUtils";

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN HOOK: Loads dashboard and provides loading/error state
// Used by ProjectDashboard.tsx to trigger data loading
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Main hook that triggers dashboard data loading.
 * Returns only loading/error state - individual panels use their own hooks.
 */
export function useProjectDashboard(projectId: string | undefined) {
  const { isLoading, error, currentProjectId, loadDashboard, clearDashboard } =
    useDashboardStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        error: state.error,
        currentProjectId: state.currentProjectId,
        loadDashboard: state.loadDashboard,
        clearDashboard: state.clearDashboard,
      }))
    );

  useEffect(() => {
    if (projectId) {
      loadDashboard(projectId);
    }
  }, [projectId, loadDashboard]);

  // Clear data when unmounting
  useEffect(() => {
    return () => {
      clearDashboard();
    };
  }, [clearDashboard]);

  return {
    isLoading,
    error,
    isReady: !isLoading && currentProjectId === projectId,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// GRANULAR HOOKS: Each panel uses its own hook
// Only re-renders when its specific data changes!
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Hook for ProjectHeader - only re-renders when project changes
 */
export function useDashboardProject() {
  return useDashboardStore((state) => state.project);
}

/**
 * Hook for DataTables panel - only re-renders when tables change
 */
export function useDashboardTables() {
  return useDashboardStore((state) => state.tables);
}

/**
 * Hook for Operations panel - returns raw operations
 * Only re-renders when operations change
 */
export function useDashboardOperations() {
  return useDashboardStore((state) => state.operations);
}

/**
 * Hook for Operations panel - returns operations grouped by date
 * Memoizes the grouping transformation
 */
export function useDashboardOperationsGrouped() {
  const operations = useDashboardStore((state) => state.operations);
  return useMemo(() => groupOperationsByDate(operations), [operations]);
}

/**
 * Hook for Governance panel - only re-renders when governance changes
 */
export function useDashboardGovernance() {
  return useDashboardStore((state) => state.governance);
}

/**
 * Hook for DataLineage panel - returns both lineage and tables
 * Uses shallow comparison to prevent re-renders when other data changes
 */
export function useDashboardLineage() {
  return useDashboardStore(
    useShallow((state) => ({
      lineage: state.lineage,
      tables: state.tables,
    }))
  );
}

/**
 * Hook to get section-specific errors
 */
export function useDashboardSectionErrors() {
  return useDashboardStore((state) => state.sectionErrors);
}
