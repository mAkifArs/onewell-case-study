import type { ReactNode } from "react";
import type { LineageGraph, SourceGroup } from "@/utils/lineageUtils";
import styles from "./DataLineage.module.scss";

interface LineageEdgesProps {
  graph: LineageGraph;
  highlightedTables: Set<string>;
}

// Gap weight (how much a gap counts relative to a node slot)
const GAP_WEIGHT = 1.5;

/**
 * Builds a mapping of table names to their Y positions based on the grouped layout.
 * Each group adds extra vertical space (gap) between groups.
 */
function buildPositionMaps(sourceGroups: SourceGroup[]): {
  sourcePositions: Map<string, number>;
  derivedPositions: Map<string, number>;
  totalSourceSlots: number;
  totalDerivedSlots: number;
} {
  const sourcePositions = new Map<string, number>();
  const derivedPositions = new Map<string, number>();

  let sourceSlot = 0;
  let derivedSlot = 0;

  sourceGroups.forEach((group, groupIndex) => {
    // Add gap before groups (except the first)
    if (groupIndex > 0) {
      sourceSlot += GAP_WEIGHT;
      derivedSlot += GAP_WEIGHT;
    }

    // Position each source in this group
    group.sources.forEach((source) => {
      sourcePositions.set(source, sourceSlot + 0.5);
      sourceSlot += 1;
    });

    // Position the derived table in the middle of its source group
    const groupMiddle = derivedSlot + group.sources.length / 2;
    derivedPositions.set(group.targetDerived, groupMiddle);
    derivedSlot += group.sources.length;
  });

  return {
    sourcePositions,
    derivedPositions,
    totalSourceSlots: sourceSlot,
    totalDerivedSlots: derivedSlot,
  };
}

export function LineageEdges({
  graph,
  highlightedTables,
}: LineageEdgesProps): ReactNode {
  const { sourcePositions, derivedPositions, totalSourceSlots, totalDerivedSlots } =
    buildPositionMaps(graph.sourceGroups);

  return (
    <div className={styles.connectors}>
      <svg className={styles.svg} preserveAspectRatio="none">
        {graph.edges.map((edge, i) => {
          const sourcePos = sourcePositions.get(edge.from);
          const derivedPos = derivedPositions.get(edge.to);
          const isHighlighted =
            highlightedTables.has(edge.from) && highlightedTables.has(edge.to);

          // Skip if source or target not found
          if (sourcePos === undefined || derivedPos === undefined) return null;

          const y1 = `${(sourcePos / totalSourceSlots) * 100}%`;
          const y2 = `${(derivedPos / totalDerivedSlots) * 100}%`;

          return (
            <line
              key={i}
              x1="0%"
              y1={y1}
              x2="100%"
              y2={y2}
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
