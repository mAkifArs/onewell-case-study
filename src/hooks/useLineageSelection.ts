// ═══════════════════════════════════════════════════════════════════════════════
// USE LINEAGE SELECTION HOOK
// Manages table selection and upstream highlighting in lineage view
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback } from "react";
import type { LineageRelation } from "@/types";
import { getUpstreamTables } from "@/utils/lineageUtils";

/**
 * Hook to manage table selection and compute highlighted tables.
 */
export function useLineageSelection(lineage: LineageRelation[]) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const highlightedTables = useMemo(() => {
    if (!selectedTable) return new Set<string>();
    const upstream = getUpstreamTables(selectedTable, lineage);
    upstream.add(selectedTable);
    return upstream;
  }, [selectedTable, lineage]);

  const handleNodeClick = useCallback((tableName: string) => {
    setSelectedTable((prev) => (prev === tableName ? null : tableName));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTable(null);
  }, []);

  return {
    selectedTable,
    highlightedTables,
    handleNodeClick,
    clearSelection,
  };
}
