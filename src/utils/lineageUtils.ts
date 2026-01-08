// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE UTILITIES
// Graph building and traversal functions for data lineage
// ═══════════════════════════════════════════════════════════════════════════════

import type { LineageRelation, ProjectTable } from "@/types";

export interface SourceGroup {
  targetDerived: string;
  sources: string[];
}

export interface LineageGraph {
  sources: string[];
  derived: string[];
  sourceGroups: SourceGroup[];
  edges: Array<{ from: string; to: string }>;
}

/**
 * Builds a graph representation from lineage relations and tables.
 * Sources = tables that are parents but NOT children (true source tables)
 * Derived = tables that are children (derived from something)
 */
export function buildLineageGraph(
  lineage: LineageRelation[],
  tables: ProjectTable[]
): LineageGraph {
  const tableNames = new Set(tables.map((t) => t.table_name));
  const edges: Array<{ from: string; to: string }> = [];

  // Collect all parent and child tables from relations
  const parentTables = new Set<string>();
  const childTables = new Set<string>();

  for (const relation of lineage) {
    if (tableNames.has(relation.parent_table)) {
      parentTables.add(relation.parent_table);
    }
    if (tableNames.has(relation.child_table)) {
      childTables.add(relation.child_table);
    }
    edges.push({ from: relation.parent_table, to: relation.child_table });
  }

  // Sources = tables that are parents but NOT derived from anything (not in childTables)
  const sources = new Set<string>();
  for (const table of parentTables) {
    if (!childTables.has(table)) {
      sources.add(table);
    }
  }

  // Also add source-type tables that aren't in any relation
  for (const table of tables) {
    if (table.table_type === "source" && !childTables.has(table.table_name)) {
      sources.add(table.table_name);
    }
  }

  // Build source groups - group sources by their target derived table
  const sourcesByDerived = new Map<string, string[]>();
  for (const edge of edges) {
    if (sources.has(edge.from)) {
      const existing = sourcesByDerived.get(edge.to) ?? [];
      existing.push(edge.from);
      sourcesByDerived.set(edge.to, existing);
    }
  }

  // Convert to sourceGroups array, maintaining derived table order
  const derivedArray = Array.from(childTables);
  const sourceGroups: SourceGroup[] = [];
  for (const derived of derivedArray) {
    const groupSources = sourcesByDerived.get(derived);
    if (groupSources && groupSources.length > 0) {
      sourceGroups.push({
        targetDerived: derived,
        sources: groupSources,
      });
    }
  }

  return {
    sources: Array.from(sources),
    derived: derivedArray,
    sourceGroups,
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
