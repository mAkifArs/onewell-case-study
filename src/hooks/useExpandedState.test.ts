// ═══════════════════════════════════════════════════════════════════════════════
// USE EXPANDED STATE HOOK TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpandedState } from "./useExpandedState";

describe("useExpandedState", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("starts with empty expanded set", () => {
      const { result } = renderHook(() => useExpandedState());
      expect(result.current.expandedIds.size).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TOGGLE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("toggle", () => {
    it("adds item to expanded set", () => {
      const { result } = renderHook(() => useExpandedState());

      act(() => {
        result.current.toggle("item-1");
      });

      expect(result.current.expandedIds.has("item-1")).toBe(true);
    });

    it("removes item from expanded set when toggled twice", () => {
      const { result } = renderHook(() => useExpandedState());

      act(() => {
        result.current.toggle("item-1");
      });
      act(() => {
        result.current.toggle("item-1");
      });

      expect(result.current.expandedIds.has("item-1")).toBe(false);
    });

    it("handles multiple items independently", () => {
      const { result } = renderHook(() => useExpandedState());

      act(() => {
        result.current.toggle("item-1");
        result.current.toggle("item-2");
      });

      expect(result.current.expandedIds.has("item-1")).toBe(true);
      expect(result.current.expandedIds.has("item-2")).toBe(true);
      expect(result.current.expandedIds.size).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // IS EXPANDED
  // ─────────────────────────────────────────────────────────────────────────────

  describe("isExpanded", () => {
    it("returns true for expanded items", () => {
      const { result } = renderHook(() => useExpandedState());

      act(() => {
        result.current.toggle("item-1");
      });

      expect(result.current.isExpanded("item-1")).toBe(true);
    });

    it("returns false for non-expanded items", () => {
      const { result } = renderHook(() => useExpandedState());

      expect(result.current.isExpanded("item-1")).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COLLAPSE ALL
  // ─────────────────────────────────────────────────────────────────────────────

  describe("collapseAll", () => {
    it("clears all expanded items", () => {
      const { result } = renderHook(() => useExpandedState());

      act(() => {
        result.current.toggle("item-1");
        result.current.toggle("item-2");
        result.current.toggle("item-3");
      });

      expect(result.current.expandedIds.size).toBe(3);

      act(() => {
        result.current.collapseAll();
      });

      expect(result.current.expandedIds.size).toBe(0);
    });
  });
});




