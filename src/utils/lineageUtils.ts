// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE UTILITIES
// Graph building and React Flow transformation for data lineage
// ═══════════════════════════════════════════════════════════════════════════════

import type { Node, Edge } from "@xyflow/react";
import type { LineageRelation, ProjectTable } from "@/types";

// Node data interface - needs index signature for React Flow compatibility
export interface LineageNodeData {
  tableName: string;
  displayName: string;
  tableType: "source" | "derived";
  [key: string]: unknown;
}

// React Flow output
export interface ReactFlowGraph {
  nodes: Node<LineageNodeData>[];
  edges: Edge[];
}

// Node dimensions for layout
const NODE_WIDTH = 176;
const NODE_HEIGHT = 54;
const HORIZONTAL_GAP = 80;
const VERTICAL_GAP = 16;

/**
 * Transforms lineage data into React Flow nodes and edges.
 * Supports many-to-one, one-to-many, and many-to-many relationships.
 */
export function buildReactFlowGraph(
  lineage: LineageRelation[],
  tables: ProjectTable[]
): ReactFlowGraph {
  const tableMap = new Map(tables.map((t) => [t.table_name, t]));

  // Deduplicate edges and collect parent/child tables
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];
  const parentTables = new Set<string>();
  const childTables = new Set<string>();

  for (const relation of lineage) {
    const edgeKey = `${relation.parent_table}->${relation.child_table}`;
    if (edgeSet.has(edgeKey)) continue;
    edgeSet.add(edgeKey);

    if (tableMap.has(relation.parent_table)) {
      parentTables.add(relation.parent_table);
    }
    if (tableMap.has(relation.child_table)) {
      childTables.add(relation.child_table);
    }

    edges.push({
      id: edgeKey,
      source: relation.parent_table,
      target: relation.child_table,
      type: "smoothstep",
      animated: false,
    });
  }

  // Identify source tables (parents but not children)
  const sources: string[] = [];
  for (const table of parentTables) {
    if (!childTables.has(table)) {
      sources.push(table);
    }
  }

  // Also add source-type tables not in relations
  for (const table of tables) {
    if (
      table.table_type === "source" &&
      !childTables.has(table.table_name) &&
      !sources.includes(table.table_name)
    ) {
      sources.push(table.table_name);
    }
  }

  const derived = Array.from(childTables);

  // Calculate positions
  const sourceHeight =
    sources.length * (NODE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP;
  const derivedHeight =
    derived.length * (NODE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP;
  const maxHeight = Math.max(sourceHeight, derivedHeight);

  const sourceStartY = (maxHeight - sourceHeight) / 2;
  const derivedStartY = (maxHeight - derivedHeight) / 2;

  // Create nodes
  const nodes: Node<LineageNodeData>[] = [];

  sources.forEach((name, index) => {
    const table = tableMap.get(name);
    nodes.push({
      id: name,
      type: "lineageNode",
      position: {
        x: 0,
        y: sourceStartY + index * (NODE_HEIGHT + VERTICAL_GAP),
      },
      data: {
        tableName: name,
        displayName: table?.display_name ?? name,
        tableType: "source",
      },
    });
  });

  derived.forEach((name, index) => {
    const table = tableMap.get(name);
    nodes.push({
      id: name,
      type: "lineageNode",
      position: {
        x: NODE_WIDTH + HORIZONTAL_GAP,
        y: derivedStartY + index * (NODE_HEIGHT + VERTICAL_GAP),
      },
      data: {
        tableName: name,
        displayName: table?.display_name ?? name,
        tableType: "derived",
      },
    });
  });

  return { nodes, edges };
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
