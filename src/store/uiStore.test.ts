// ═══════════════════════════════════════════════════════════════════════════════
// UI STORE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useUIStore } from "./uiStore";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-color-scheme: dark)" ? false : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ─────────────────────────────────────────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────────────────────────────────────────

function resetStore() {
  useUIStore.setState({
    theme: "light",
    highlightedLineageNode: null,
  });
}

describe("uiStore", () => {
  beforeEach(() => {
    resetStore();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────────────────────────────────────

  describe("theme", () => {
    it("can set theme to light", () => {
      useUIStore.getState().setTheme("light");
      expect(useUIStore.getState().theme).toBe("light");
    });

    it("can set theme to dark", () => {
      useUIStore.getState().setTheme("dark");
      expect(useUIStore.getState().theme).toBe("dark");
    });

    it("persists theme changes", () => {
      useUIStore.getState().setTheme("dark");
      const state = useUIStore.getState();
      expect(state.theme).toBe("dark");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // LINEAGE HIGHLIGHTING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("highlightedLineageNode", () => {
    it("starts with no highlighted node", () => {
      expect(useUIStore.getState().highlightedLineageNode).toBeNull();
    });

    it("can set highlighted node", () => {
      useUIStore.getState().setHighlightedLineageNode("customers");
      expect(useUIStore.getState().highlightedLineageNode).toBe("customers");
    });

    it("can change highlighted node", () => {
      useUIStore.getState().setHighlightedLineageNode("customers");
      useUIStore.getState().setHighlightedLineageNode("orders");
      expect(useUIStore.getState().highlightedLineageNode).toBe("orders");
    });

    it("can clear highlighted node with setHighlightedLineageNode(null)", () => {
      useUIStore.getState().setHighlightedLineageNode("customers");
      useUIStore.getState().setHighlightedLineageNode(null);
      expect(useUIStore.getState().highlightedLineageNode).toBeNull();
    });

    it("can clear highlighted node with clearHighlightedLineageNode", () => {
      useUIStore.getState().setHighlightedLineageNode("customers");
      useUIStore.getState().clearHighlightedLineageNode();
      expect(useUIStore.getState().highlightedLineageNode).toBeNull();
    });
  });
});

