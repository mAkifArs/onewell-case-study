import type { ReactNode } from "react";
import type { LineageGraph } from "@/utils/lineageUtils";
import styles from "./DataLineage.module.scss";

interface LineageEdgesProps {
  graph: LineageGraph;
  highlightedTables: Set<string>;
}

/**
 * Calculates the Y position percentage for a node using space-evenly distribution.
 * With space-evenly, items are at positions: (index + 1) / (count + 1)
 */
function getNodeYPosition(index: number, count: number): string {
  if (count === 0) return "50%";
  return `${((index + 1) / (count + 1)) * 100}%`;
}

export function LineageEdges({
  graph,
  highlightedTables,
}: LineageEdgesProps): ReactNode {
  return (
    <div className={styles.connectors}>
      <svg className={styles.svg} preserveAspectRatio="none">
        {graph.edges.map((edge, i) => {
          const sourceIndex = graph.sources.indexOf(edge.from);
          const derivedIndex = graph.derived.indexOf(edge.to);
          const isHighlighted =
            highlightedTables.has(edge.from) && highlightedTables.has(edge.to);

          // Skip if source or target not found
          if (sourceIndex === -1 || derivedIndex === -1) return null;

          return (
            <line
              key={i}
              x1="0%"
              y1={getNodeYPosition(sourceIndex, graph.sources.length)}
              x2="100%"
              y2={getNodeYPosition(derivedIndex, graph.derived.length)}
              className={styles.edge}
              data-highlighted={isHighlighted}
              data-testid={`lineage-edge-${edge.from}-${edge.to}`}
            />
          );
        })}
      </svg>
    </div>
  );
}
