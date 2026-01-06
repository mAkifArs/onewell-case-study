// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE UTILITIES
// Graph building and traversal functions for data lineage
// ═══════════════════════════════════════════════════════════════════════════════

import type { LineageRelation, ProjectTable } from "@/types";

export interface LineageGraph {
  sources: string[];
  derived: string[];
  edges: Array<{ from: string; to: string }>;
}

/**
 * Builds a graph representation from lineage relations and tables.
 */
export function buildLineageGraph(
  lineage: LineageRelation[],
  tables: ProjectTable[]
): LineageGraph {
  const tableNames = new Set(tables.map((t) => t.table_name));
  const sources = new Set<string>();
  const derived = new Set<string>();
  const edges: Array<{ from: string; to: string }> = [];

  for (const relation of lineage) {
    if (tableNames.has(relation.parent_table)) {
      sources.add(relation.parent_table);
    }
    if (tableNames.has(relation.child_table)) {
      derived.add(relation.child_table);
    }
    edges.push({ from: relation.parent_table, to: relation.child_table });
  }

  // Tables that are only sources (not derived from anything)
  const derivedSet = new Set(lineage.map((l) => l.child_table));
  for (const table of tables) {
    if (!derivedSet.has(table.table_name) && table.table_type === "source") {
      sources.add(table.table_name);
    }
  }

  return {
    sources: Array.from(sources),
    derived: Array.from(derived),
    edges,
  };
}

/**
 * Gets all upstream (parent) tables for a given table.
 */
export function getUpstreamTables(
  tableName: string,
  lineage: LineageRelation[]
): Set<string> {
  const upstream = new Set<string>();
  const queue = [tableName];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const relation of lineage) {
      if (relation.child_table === current) {
        if (!upstream.has(relation.parent_table)) {
          upstream.add(relation.parent_table);
          queue.push(relation.parent_table);
        }
      }
    }
  }

  return upstream;
}
