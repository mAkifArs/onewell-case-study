import type { ReactNode } from "react";
import type { LineageGraph as LineageGraphType } from "@/utils/lineageUtils";
import { LineageColumn } from "./LineageColumn";
import { LineageEdges } from "./LineageEdges";
import styles from "./DataLineage.module.scss";

interface LineageGraphProps {
  graph: LineageGraphType;
  highlightedTables: Set<string>;
  selectedTable: string | null;
  onNodeClick: (tableName: string) => void;
}

export function LineageGraph({
  graph,
  highlightedTables,
  selectedTable,
  onNodeClick,
}: LineageGraphProps): ReactNode {
  return (
    <div className={styles.graph}>
      {/* Labels row */}
      <div className={styles.labelsRow}>
        <span className={styles.columnLabel}>Source</span>
        <div className={styles.labelSpacer} />
        <span className={styles.columnLabel}>Derived</span>
      </div>

      {/* Nodes row with connectors */}
      <div className={styles.nodesRow}>
        <LineageColumn
          tables={graph.sources}
          type="source"
          highlightedTables={highlightedTables}
          selectedTable={selectedTable}
          onNodeClick={onNodeClick}
        />

        <LineageEdges graph={graph} highlightedTables={highlightedTables} />

        <LineageColumn
          tables={graph.derived}
          type="derived"
          highlightedTables={highlightedTables}
          selectedTable={selectedTable}
          onNodeClick={onNodeClick}
        />
      </div>
    </div>
  );
}
