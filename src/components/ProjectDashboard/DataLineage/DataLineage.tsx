import type { ReactNode } from "react";
import { useState, useMemo } from "react";
import type { LineageRelation, ProjectTable } from "@/types";
import { LineageNode } from "./LineageNode";
import styles from "./DataLineage.module.scss";

interface DataLineageProps {
  lineage: LineageRelation[];
  tables: ProjectTable[];
}

interface LineageGraph {
  sources: string[];
  derived: string[];
  edges: Array<{ from: string; to: string }>;
}

function buildGraph(
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

function getUpstreamTables(
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

export function DataLineage({ lineage, tables }: DataLineageProps): ReactNode {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const graph = useMemo(() => buildGraph(lineage, tables), [lineage, tables]);

  const highlightedTables = useMemo(() => {
    if (!selectedTable) return new Set<string>();
    const upstream = getUpstreamTables(selectedTable, lineage);
    upstream.add(selectedTable);
    return upstream;
  }, [selectedTable, lineage]);

  if (lineage.length === 0) {
    return <p className={styles.empty}>No lineage data available</p>;
  }

  const handleNodeClick = (tableName: string) => {
    setSelectedTable((prev) => (prev === tableName ? null : tableName));
  };

  return (
    <div className={styles.container} data-testid="lineage-view">
      <div className={styles.graph}>
        {/* Source tables column */}
        <div className={styles.column}>
          <span className={styles.columnLabel}>Source</span>
          <div className={styles.nodes}>
            {graph.sources.map((name) => (
              <LineageNode
                key={name}
                name={name}
                type="source"
                isHighlighted={highlightedTables.has(name)}
                isSelected={selectedTable === name}
                onClick={() => handleNodeClick(name)}
              />
            ))}
          </div>
        </div>

        {/* Connector lines (simple visual) */}
        <div className={styles.connectors}>
          <svg className={styles.svg} preserveAspectRatio="none">
            {graph.edges.map((edge, i) => {
              const isHighlighted =
                highlightedTables.has(edge.from) &&
                highlightedTables.has(edge.to);
              return (
                <line
                  key={i}
                  x1="0%"
                  y1={`${((graph.sources.indexOf(edge.from) + 0.5) / graph.sources.length) * 100}%`}
                  x2="100%"
                  y2={`${((graph.derived.indexOf(edge.to) + 0.5) / graph.derived.length) * 100}%`}
                  className={styles.edge}
                  data-highlighted={isHighlighted}
                  data-testid={`lineage-edge-${edge.from}-${edge.to}`}
                />
              );
            })}
          </svg>
        </div>

        {/* Derived tables column */}
        <div className={styles.column}>
          <span className={styles.columnLabel}>Derived</span>
          <div className={styles.nodes}>
            {graph.derived.map((name) => (
              <LineageNode
                key={name}
                name={name}
                type="derived"
                isHighlighted={highlightedTables.has(name)}
                isSelected={selectedTable === name}
                onClick={() => handleNodeClick(name)}
              />
            ))}
          </div>
        </div>
      </div>

      <p className={styles.hint}>Click a table to highlight its upstream dependencies</p>
    </div>
  );
}

