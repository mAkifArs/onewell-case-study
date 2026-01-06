// ═══════════════════════════════════════════════════════════════════════════════
// USE PROJECTS HOOK
// Custom hook for accessing and loading projects
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect } from "react";
import { useProjectStore } from "@/store";

/**
 * Hook to access and auto-load projects from the global store.
 * Automatically triggers fetch on mount if projects aren't loaded.
 */
export function useProjects() {
  const projects = useProjectStore((state) => state.projects);
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);
  const loadProjects = useProjectStore((state) => state.loadProjects);

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

