// ═══════════════════════════════════════════════════════════════════════════════
// DATE UTILITIES
// Only what we actually need for this dashboard
// ═══════════════════════════════════════════════════════════════════════════════

import { format, parseISO, isValid, isToday, isYesterday } from "date-fns";

/**
 * Format a date as "Jan 15, 2025"
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
}

/**
 * Get a grouping key for operations timeline.
 * Returns "Today", "Yesterday", or "January 15, 2025"
 */
export function getDateGroupKey(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Unknown";

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  } catch {
    return "Unknown";
  }
}
