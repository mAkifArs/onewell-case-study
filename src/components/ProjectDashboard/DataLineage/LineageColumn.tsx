import type { ReactNode } from "react";
import type { SourceGroup } from "@/utils/lineageUtils";
import { LineageNode } from "./LineageNode";
import styles from "./DataLineage.module.scss";

interface LineageColumnProps {
  sourceGroups: SourceGroup[];
  type: "source" | "derived";
  highlightedTables: Set<string>;
  selectedTable: string | null;
  onNodeClick: (tableName: string) => void;
}

export function LineageColumn({
  sourceGroups,
  type,
  highlightedTables,
  selectedTable,
  onNodeClick,
}: LineageColumnProps): ReactNode {
  return (
    <div className={styles.column}>
      {sourceGroups.map((group, groupIndex) => (
        <div
          key={group.targetDerived}
          className={styles.lineageGroup}
          data-has-gap={groupIndex > 0}
        >
          {type === "source" ? (
            // Render source tables for this group
            group.sources.map((name) => (
              <LineageNode
                key={name}
                name={name}
                type="source"
                isHighlighted={highlightedTables.has(name)}
                isSelected={selectedTable === name}
                onClick={() => onNodeClick(name)}
              />
            ))
          ) : (
            // Render derived table for this group
            <LineageNode
              name={group.targetDerived}
              type="derived"
              isHighlighted={highlightedTables.has(group.targetDerived)}
              isSelected={selectedTable === group.targetDerived}
              onClick={() => onNodeClick(group.targetDerived)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
