// ═══════════════════════════════════════════════════════════════════════════════
// USE PROJECT DASHBOARD HOOK
// Custom hook for accessing project dashboard data
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect } from "react";
import { useDashboardStore } from "@/store";

/**
 * Hook to access and auto-load project dashboard data.
 * Automatically triggers fetch when projectId changes.
 */
export function useProjectDashboard(projectId: string | undefined) {
  const data = useDashboardStore((state) => state.data);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const currentProjectId = useDashboardStore((state) => state.currentProjectId);
  const loadDashboard = useDashboardStore((state) => state.loadDashboard);
  const clearDashboard = useDashboardStore((state) => state.clearDashboard);

  useEffect(() => {
    if (projectId) {
      loadDashboard(projectId);
    }
  }, [projectId, loadDashboard]);

  // Clear data when unmounting or projectId becomes undefined
  useEffect(() => {
    return () => {
      // Only clear if navigating away (projectId undefined)
      if (!projectId) {
        clearDashboard();
      }
    };
  }, [projectId, clearDashboard]);

  return {
    data,
    isLoading,
    error,
    isReady: !isLoading && data !== null && currentProjectId === projectId,
    reload: () => {
      if (projectId) {
        // Force reload by clearing first
        clearDashboard();
        loadDashboard(projectId);
      }
    },
  };
}
