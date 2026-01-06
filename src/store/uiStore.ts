// ═══════════════════════════════════════════════════════════════════════════════
// UI STORE
// Manages global UI state: theme, cross-component interactions
//
// NOTE: Local UI state (expanded accordions, toggled panels) should use useState
// in the component. Only use global store for:
// - Persisted settings (theme)
// - Cross-component communication (lineage highlighting)
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

// Detect system preference
function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface UIState {
  /** Current theme setting (persisted) */
  theme: Theme;

  /** Set the theme */
  setTheme: (theme: Theme) => void;

  /** Currently highlighted node in lineage view (cross-component) */
  highlightedLineageNode: string | null;

  /** Set the highlighted lineage node */
  setHighlightedLineageNode: (id: string | null) => void;

  /** Clear highlighted lineage node */
  clearHighlightedLineageNode: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────────

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // ─────────────────────────────────────────────────────────────────────────
      // THEME (persisted) - defaults to system preference
      // ─────────────────────────────────────────────────────────────────────────
      theme: getSystemTheme(),

      setTheme: (theme) => set({ theme }),

      // ─────────────────────────────────────────────────────────────────────────
      // LINEAGE HIGHLIGHTING (cross-component communication)
      // Used when clicking a table in lineage to highlight dependencies
      // ─────────────────────────────────────────────────────────────────────────
      highlightedLineageNode: null,

      setHighlightedLineageNode: (id) => set({ highlightedLineageNode: id }),

      clearHighlightedLineageNode: () => set({ highlightedLineageNode: null }),
    }),
    {
      name: "onewell-ui", // localStorage key
      // Only persist theme preference
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
