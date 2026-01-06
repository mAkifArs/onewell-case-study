// ═══════════════════════════════════════════════════════════════════════════════
// OPERATION UTILITIES
// Grouping and processing functions for operations timeline
// ═══════════════════════════════════════════════════════════════════════════════

import type { Operation } from "@/types";
import { getDateGroupKey } from "./dateUtils";

export interface GroupedOperations {
  date: string;
  operations: Operation[];
}

/**
 * Groups operations by date for timeline display.
 */
export function groupOperationsByDate(
  operations: Operation[]
): GroupedOperations[] {
  const groups = new Map<string, Operation[]>();

  for (const op of operations) {
    const key = getDateGroupKey(op.execution_timestamp);
    const existing = groups.get(key) ?? [];
    groups.set(key, [...existing, op]);
  }

  return Array.from(groups.entries()).map(([date, ops]) => ({
    date,
    operations: ops,
  }));
}
