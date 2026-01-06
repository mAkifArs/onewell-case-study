// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT STORE
// Manages project selection state with persistence
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ProjectState {
  /** Currently selected project ID */
  selectedProjectId: string | null;

  /** Select a project by ID (or null to deselect) */
  selectProject: (id: string | null) => void;

  /** Clear the selected project */
  clearSelection: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      selectedProjectId: null,

      selectProject: (id) => set({ selectedProjectId: id }),

      clearSelection: () => set({ selectedProjectId: null }),
    }),
    {
      name: "onewell-project", // localStorage key
    }
  )
);
