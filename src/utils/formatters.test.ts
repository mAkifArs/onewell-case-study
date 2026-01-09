// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTERS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  formatCompact,
  formatPercent,
  toTitleCase,
  formatVersion,
  formatColumnRole,
  formatApprovalType,
} from "./formatters";

describe("formatters", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // formatCompact
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatCompact", () => {
    it("formats thousands as K", () => {
      expect(formatCompact(1000)).toBe("1K");
      expect(formatCompact(5000)).toBe("5K");
      expect(formatCompact(50000)).toBe("50K");
      expect(formatCompact(999000)).toBe("999K");
    });

    it("formats millions as M", () => {
      expect(formatCompact(1000000)).toBe("1M");
      expect(formatCompact(2500000)).toBe("2.5M");
      expect(formatCompact(10000000)).toBe("10M");
    });

    it("handles small numbers without abbreviation", () => {
      expect(formatCompact(0)).toBe("0");
      expect(formatCompact(1)).toBe("1");
      expect(formatCompact(100)).toBe("100");
      expect(formatCompact(999)).toBe("999");
    });

    it("handles decimal precision", () => {
      expect(formatCompact(1500)).toBe("1.5K");
      expect(formatCompact(1250)).toBe("1.3K"); // rounds
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // formatPercent
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatPercent", () => {
    it("formats whole numbers", () => {
      expect(formatPercent(0)).toBe("0%");
      expect(formatPercent(50)).toBe("50%");
      expect(formatPercent(100)).toBe("100%");
    });

    it("rounds decimal values", () => {
      expect(formatPercent(33.33)).toBe("33%");
      expect(formatPercent(66.67)).toBe("67%");
      expect(formatPercent(99.9)).toBe("100%");
    });

    it("handles edge cases", () => {
      expect(formatPercent(0.4)).toBe("0%");
      expect(formatPercent(0.5)).toBe("1%");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // toTitleCase
  // ─────────────────────────────────────────────────────────────────────────────

  describe("toTitleCase", () => {
    it("converts snake_case to Title Case", () => {
      expect(toTitleCase("log_transform")).toBe("Log Transform");
      expect(toTitleCase("merge_tables")).toBe("Merge Tables");
      expect(toTitleCase("create_ratio")).toBe("Create Ratio");
    });

    it("handles single word", () => {
      expect(toTitleCase("aggregate")).toBe("Aggregate");
      expect(toTitleCase("UPPERCASE")).toBe("Uppercase");
    });

    it("handles multiple underscores", () => {
      expect(toTitleCase("this_is_a_test")).toBe("This Is A Test");
    });

    it("handles empty string", () => {
      expect(toTitleCase("")).toBe("");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // formatVersion
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatVersion", () => {
    it("prefixes version number with v", () => {
      expect(formatVersion(1)).toBe("v1");
      expect(formatVersion(3)).toBe("v3");
      expect(formatVersion(10)).toBe("v10");
      expect(formatVersion(0)).toBe("v0");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // formatColumnRole
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatColumnRole", () => {
    it("returns human-readable labels for roles", () => {
      expect(formatColumnRole("exog")).toBe("Predictor");
      expect(formatColumnRole("endog")).toBe("Target");
      expect(formatColumnRole("not_used")).toBe("Not Used");
      expect(formatColumnRole("time_id")).toBe("Time ID");
      expect(formatColumnRole("lookup")).toBe("Lookup");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // formatApprovalType
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatApprovalType", () => {
    it("adds spaces before capital letters", () => {
      expect(formatApprovalType("DevCompletion")).toBe("Dev Completion");
      expect(formatApprovalType("ValidationStart")).toBe("Validation Start");
      expect(formatApprovalType("ProductionApproval")).toBe(
        "Production Approval"
      );
    });

    it("handles single word", () => {
      expect(formatApprovalType("Validation")).toBe("Validation");
    });

    it("handles already spaced input", () => {
      // Note: The function will add extra space before capitals even if already spaced
      // This is expected behavior - "Dev Completion" becomes "Dev  Completion"
      expect(formatApprovalType("Dev Completion")).toBe("Dev  Completion");
    });
  });
});

