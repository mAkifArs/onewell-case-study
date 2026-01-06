import type { ReactNode } from "react";
import type { ProjectTable } from "@/types";
import { useExpandedState } from "@/hooks";
import { EmptyState } from "@/components/EmptyState";
import { TableRow } from "./TableRow";
import styles from "./DataTables.module.scss";

interface DataTablesProps {
  tables: ProjectTable[];
}

export function DataTables({ tables }: DataTablesProps): ReactNode {
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
}
