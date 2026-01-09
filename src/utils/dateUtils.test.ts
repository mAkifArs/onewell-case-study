// ═══════════════════════════════════════════════════════════════════════════════
// DATE UTILS TESTS
// Note: Tests use local timezone since date-fns formats in local time
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDate, formatTime, getDateGroupKey } from "./dateUtils";

describe("dateUtils", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // formatDate
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatDate", () => {
    it("formats ISO date string correctly", () => {
      // Use date-only format to avoid timezone issues
      expect(formatDate("2025-01-15")).toBe("Jan 15, 2025");
      expect(formatDate("2024-12-25")).toBe("Dec 25, 2024");
      expect(formatDate("2023-06-01")).toBe("Jun 1, 2023");
    });

    it("formats datetime strings", () => {
      // The result depends on local timezone, so just verify it returns a valid format
      const result = formatDate("2025-01-15T10:30:00Z");
      expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
    });

    it('returns "Invalid date" for invalid input', () => {
      expect(formatDate("not-a-date")).toBe("Invalid date");
      expect(formatDate("")).toBe("Invalid date");
      expect(formatDate("2025-13-45")).toBe("Invalid date");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // formatTime
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatTime", () => {
    it("formats time in 12-hour format with AM/PM", () => {
      // The result depends on local timezone, so just verify it returns a valid format
      const result = formatTime("2025-01-15T10:30:00Z");
      expect(result).toMatch(/^\d{1,2}:\d{2} [AP]M$/);
    });

    it("returns empty string for invalid input", () => {
      expect(formatTime("not-a-date")).toBe("");
      expect(formatTime("")).toBe("");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // getDateGroupKey
  // ─────────────────────────────────────────────────────────────────────────────

  describe("getDateGroupKey", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Today" for today\'s date', () => {
      // Set system time and use a date that's clearly today regardless of timezone
      const now = new Date("2025-01-15T12:00:00");
      vi.setSystemTime(now);

      // Create a date string for the same local date
      const todayStr = now.toISOString();
      expect(getDateGroupKey(todayStr)).toBe("Today");
    });

    it('returns "Yesterday" for yesterday\'s date', () => {
      const now = new Date("2025-01-15T12:00:00");
      vi.setSystemTime(now);

      const yesterday = new Date("2025-01-14T12:00:00");
      expect(getDateGroupKey(yesterday.toISOString())).toBe("Yesterday");
    });

    it("returns full date for older dates", () => {
      const now = new Date("2025-01-15T12:00:00");
      vi.setSystemTime(now);

      // Use date-only strings to avoid timezone issues
      const result = getDateGroupKey("2025-01-10");
      expect(result).toBe("January 10, 2025");
    });

    it('returns "Unknown" for invalid dates', () => {
      expect(getDateGroupKey("not-a-date")).toBe("Unknown");
      expect(getDateGroupKey("")).toBe("Unknown");
    });
  });
});
