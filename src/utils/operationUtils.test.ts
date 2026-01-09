// ═══════════════════════════════════════════════════════════════════════════════
// OPERATION UTILS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { groupOperationsByDate } from "./operationUtils";
import type { Operation } from "@/types";

// Factory for creating test operations
function createOperation(
  id: string,
  timestamp: string,
  name: string = "test_operation"
): Operation {
  return {
    operation_log_id: id,
    operation_type: "table_action",
    operation_name: name,
    input_parameters: {},
    executed_by: { user_id: "user-1", name: "Test User" },
    execution_timestamp: timestamp,
    affected_table: "test_table",
    output_table_version: null,
  };
}

describe("operationUtils", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // groupOperationsByDate
  // ─────────────────────────────────────────────────────────────────────────────

  describe("groupOperationsByDate", () => {
    beforeEach(() => {
      // Mock current date to 2025-01-15
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns empty array for empty input", () => {
      expect(groupOperationsByDate([])).toEqual([]);
    });

    it("groups single operation correctly", () => {
      const operations = [createOperation("op-1", "2025-01-15T10:00:00Z")];

      const result = groupOperationsByDate(operations);

      expect(result).toHaveLength(1);
      expect(result[0].date).toBe("Today");
      expect(result[0].operations).toHaveLength(1);
    });

    it("groups multiple operations on same day", () => {
      const operations = [
        createOperation("op-1", "2025-01-15T10:00:00Z"),
        createOperation("op-2", "2025-01-15T14:00:00Z"),
        createOperation("op-3", "2025-01-15T18:00:00Z"),
      ];

      const result = groupOperationsByDate(operations);

      expect(result).toHaveLength(1);
      expect(result[0].date).toBe("Today");
      expect(result[0].operations).toHaveLength(3);
    });

    it("separates operations by different days", () => {
      const operations = [
        createOperation("op-1", "2025-01-15T10:00:00Z"), // Today
        createOperation("op-2", "2025-01-14T14:00:00Z"), // Yesterday
        createOperation("op-3", "2025-01-10T18:00:00Z"), // January 10, 2025
      ];

      const result = groupOperationsByDate(operations);

      expect(result).toHaveLength(3);

      const dates = result.map((g) => g.date);
      expect(dates).toContain("Today");
      expect(dates).toContain("Yesterday");
      expect(dates).toContain("January 10, 2025");
    });

    it("maintains operation order within groups", () => {
      const operations = [
        createOperation("op-1", "2025-01-15T10:00:00Z", "first"),
        createOperation("op-2", "2025-01-15T14:00:00Z", "second"),
        createOperation("op-3", "2025-01-15T18:00:00Z", "third"),
      ];

      const result = groupOperationsByDate(operations);
      const ops = result[0].operations;

      expect(ops[0].operation_name).toBe("first");
      expect(ops[1].operation_name).toBe("second");
      expect(ops[2].operation_name).toBe("third");
    });

    it("handles operations with mixed dates", () => {
      const operations = [
        createOperation("op-1", "2025-01-15T10:00:00Z"), // Today
        createOperation("op-2", "2025-01-13T14:00:00Z"), // Jan 13
        createOperation("op-3", "2025-01-15T18:00:00Z"), // Today
        createOperation("op-4", "2025-01-13T09:00:00Z"), // Jan 13
      ];

      const result = groupOperationsByDate(operations);

      expect(result).toHaveLength(2);

      const todayGroup = result.find((g) => g.date === "Today");
      const jan13Group = result.find((g) => g.date === "January 13, 2025");

      expect(todayGroup?.operations).toHaveLength(2);
      expect(jan13Group?.operations).toHaveLength(2);
    });
  });
});

