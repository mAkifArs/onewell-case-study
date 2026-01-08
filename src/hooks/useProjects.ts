// ═══════════════════════════════════════════════════════════════════════════════
// USE PROJECTS HOOK
// Custom hook for accessing and loading projects
// Uses shallow comparison to minimize re-renders
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useProjectStore } from "@/store";

/**
 * Hook to access and auto-load projects from the global store.
 * Automatically triggers fetch on mount if projects aren't loaded.
 * Uses shallow selector to prevent unnecessary re-renders.
 */
export function useProjects() {
  // Single selector with shallow comparison - only re-renders when values actually change
  const { projects, isLoading, error, loadProjects } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      isLoading: state.isLoading,
      error: state.error,
      loadProjects: state.loadProjects,
    }))
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    error,
    reload: loadProjects,
  };
}
