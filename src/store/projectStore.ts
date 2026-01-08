// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT STORE
// Manages project list and selection state
// localStorage is ONLY used for offline fallback (not automatic caching)
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import type { Project } from "@/types";
import { fetchProjects } from "@/services";

// ─────────────────────────────────────────────────────────────────────────────────
// OFFLINE STORAGE HELPERS
// Only used when network is unavailable
// ─────────────────────────────────────────────────────────────────────────────────

const OFFLINE_STORAGE_KEY = "onewell-offline-projects";

function saveForOffline(projects: Project[]): void {
  try {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // localStorage might be full or unavailable
  }
}

function loadFromOfflineStorage(): Project[] | null {
  try {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

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

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  isLoading: true, // Start with loading true to avoid initial flash
  error: null,
  selectedProjectId: null,

  loadProjects: async () => {
    const state = get();

    // Skip if we already have data
    if (state.projects.length > 0) return;

    const isOnline = navigator.onLine;

    // OFFLINE: Try to load from localStorage
    if (!isOnline) {
      const cached = loadFromOfflineStorage();
      if (cached && cached.length > 0) {
        set({ projects: cached });
        return;
      }
      set({ error: "No internet connection and no cached data available" });
      return;
    }

    // ONLINE: Fetch from API (isLoading is already true from initial state)
    try {
      const data = await fetchProjects();
      set({ projects: data, isLoading: false, error: null });

      // Save for offline use
      saveForOffline(data);
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
}));
