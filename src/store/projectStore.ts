// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT STORE
// Manages project list and selection state
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/types";
import { fetchProjects } from "@/services";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ProjectState {
  /** List of all projects */
  projects: Project[];

  /** Loading state for projects list */
  isLoading: boolean;

  /** Error message if fetch failed */
  error: string | null;

  /** Currently selected project ID */
  selectedProjectId: string | null;

  /** Fetch all projects from API */
  loadProjects: () => Promise<void>;

  /** Select a project by ID (or null to deselect) */
  selectProject: (id: string | null) => void;

  /** Clear the selected project */
  clearSelection: () => void;

  /** Clear error state */
  clearError: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      isLoading: false,
      error: null,
      selectedProjectId: null,

      loadProjects: async () => {
        // Skip if already loading or data exists
        if (get().isLoading) return;
        if (get().projects.length > 0) return;

        set({ isLoading: true, error: null });

        try {
          const data = await fetchProjects();
          set({ projects: data, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to load projects",
            isLoading: false,
          });
        }
      },

      selectProject: (id) => set({ selectedProjectId: id }),

      clearSelection: () => set({ selectedProjectId: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "onewell-project",
      // Only persist selectedProjectId, not the fetched data
      partialize: (state) => ({ selectedProjectId: state.selectedProjectId }),
    }
  )
);
