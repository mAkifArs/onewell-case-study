// ═══════════════════════════════════════════════════════════════════════════════
// USE LINEAGE SELECTION HOOK TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLineageSelection } from "./useLineageSelection";
import type { LineageRelation } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────────────────────

const mockLineage: LineageRelation[] = [
  { parent_table: "customers", child_table: "combined", parent_type: "source_dataset" },
  { parent_table: "products", child_table: "combined", parent_type: "source_dataset" },
  { parent_table: "combined", child_table: "final", parent_type: "source_dataset" },
];

describe("useLineageSelection", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("starts with no selected table", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));
      expect(result.current.selectedTable).toBeNull();
    });

    it("starts with empty highlighted set", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));
      expect(result.current.highlightedTables.size).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // NODE CLICK
  // ─────────────────────────────────────────────────────────────────────────────

  describe("handleNodeClick", () => {
    it("selects table on click", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("combined");
      });

      expect(result.current.selectedTable).toBe("combined");
    });

    it("deselects table when clicking same table again", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("combined");
      });
      act(() => {
        result.current.handleNodeClick("combined");
      });

      expect(result.current.selectedTable).toBeNull();
    });

    it("switches selection when clicking different table", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("combined");
      });
      act(() => {
        result.current.handleNodeClick("final");
      });

      expect(result.current.selectedTable).toBe("final");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // HIGHLIGHTED TABLES
  // ─────────────────────────────────────────────────────────────────────────────

  describe("highlightedTables", () => {
    it("highlights selected table", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("customers");
      });

      expect(result.current.highlightedTables.has("customers")).toBe(true);
    });

    it("highlights upstream tables for derived table", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("combined");
      });

      // combined + its parents (customers, products)
      expect(result.current.highlightedTables.has("combined")).toBe(true);
      expect(result.current.highlightedTables.has("customers")).toBe(true);
      expect(result.current.highlightedTables.has("products")).toBe(true);
      expect(result.current.highlightedTables.size).toBe(3);
    });

    it("highlights entire chain for deeply derived table", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("final");
      });

      // final -> combined -> customers, products
      expect(result.current.highlightedTables.has("final")).toBe(true);
      expect(result.current.highlightedTables.has("combined")).toBe(true);
      expect(result.current.highlightedTables.has("customers")).toBe(true);
      expect(result.current.highlightedTables.has("products")).toBe(true);
      expect(result.current.highlightedTables.size).toBe(4);
    });

    it("clears highlights when selection cleared", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("final");
      });

      expect(result.current.highlightedTables.size).toBe(4);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.highlightedTables.size).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // CLEAR SELECTION
  // ─────────────────────────────────────────────────────────────────────────────

  describe("clearSelection", () => {
    it("clears selected table", () => {
      const { result } = renderHook(() => useLineageSelection(mockLineage));

      act(() => {
        result.current.handleNodeClick("combined");
      });

      expect(result.current.selectedTable).toBe("combined");

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedTable).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPTY LINEAGE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("with empty lineage", () => {
    it("only highlights selected table", () => {
      const { result } = renderHook(() => useLineageSelection([]));

      act(() => {
        result.current.handleNodeClick("some-table");
      });

      expect(result.current.highlightedTables.has("some-table")).toBe(true);
      expect(result.current.highlightedTables.size).toBe(1);
    });
  });
});




