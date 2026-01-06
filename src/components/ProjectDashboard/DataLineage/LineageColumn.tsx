import type { ReactNode } from "react";
import { LineageNode } from "./LineageNode";
import styles from "./DataLineage.module.scss";

interface LineageColumnProps {
  tables: string[];
  type: "source" | "derived";
  highlightedTables: Set<string>;
  selectedTable: string | null;
  onNodeClick: (tableName: string) => void;
}

export function LineageColumn({
  tables,
  type,
  highlightedTables,
  selectedTable,
  onNodeClick,
}: LineageColumnProps): ReactNode {
  return (
    <div className={styles.column}>
      {tables.map((name) => (
        <LineageNode
          key={name}
          name={name}
          type={type}
          isHighlighted={highlightedTables.has(name)}
          isSelected={selectedTable === name}
          onClick={() => onNodeClick(name)}
        />
      ))}
    </div>
  );
}
