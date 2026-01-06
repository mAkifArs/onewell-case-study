import type { ReactNode } from "react";
import { useMemo } from "react";
import type { LineageRelation, ProjectTable } from "@/types";
import { useLineageSelection } from "@/hooks";
import { buildLineageGraph } from "@/utils/lineageUtils";
import { EmptyState } from "@/components/EmptyState";
import { LineageGraph } from "./LineageGraph";
import styles from "./DataLineage.module.scss";

interface DataLineageProps {
  lineage: LineageRelation[];
  tables: ProjectTable[];
}

export function DataLineage({ lineage, tables }: DataLineageProps): ReactNode {
  const graph = useMemo(
    () => buildLineageGraph(lineage, tables),
    [lineage, tables]
  );

  const { selectedTable, highlightedTables, handleNodeClick } =
    useLineageSelection(lineage);

  if (lineage.length === 0) {
    return <EmptyState message="No lineage data available" />;
  }

  return (
    <div className={styles.container} data-testid="lineage-view">
      <LineageGraph
        graph={graph}
        highlightedTables={highlightedTables}
        selectedTable={selectedTable}
        onNodeClick={handleNodeClick}
      />

      <p className={styles.hint}>
        Click a table to highlight its upstream dependencies
      </p>
    </div>
  );
}
