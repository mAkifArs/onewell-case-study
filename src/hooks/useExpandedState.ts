// ═══════════════════════════════════════════════════════════════════════════════
// USE EXPANDED STATE HOOK
// Manages a set of expanded item IDs with toggle functionality
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";

/**
 * Hook to manage expanded/collapsed state for a list of items.
 * Returns a set of expanded IDs and a toggle function.
 */
export function useExpandedState() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (id: string) => expandedIds.has(id),
    [expandedIds]
  );

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return {
    expandedIds,
    toggle,
    isExpanded,
    collapseAll,
  };
}

