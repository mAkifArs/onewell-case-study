import { memo, type ReactNode } from "react";
import { useExpandedState, useDashboardTables } from "@/hooks";
import { EmptyState } from "@/components/EmptyState";
import { TableRow } from "./TableRow";
import styles from "./DataTables.module.scss";

/**
 * Data tables component - uses store directly.
 * Only re-renders when tables data changes.
 */
export const DataTables = memo(function DataTables(): ReactNode {
  const tables = useDashboardTables();
  const { expandedIds: expandedTables, toggle: toggleTable } =
    useExpandedState();

  if (tables.length === 0) {
    return <EmptyState message="No tables in this project" />;
  }

  return (
    <div className={styles.list}>
      {tables.map((table) => (
        <TableRow
          key={table.project_table_id}
          table={table}
          isExpanded={expandedTables.has(table.project_table_id)}
          onToggle={() => toggleTable(table.project_table_id)}
        />
      ))}
    </div>
  );
});
