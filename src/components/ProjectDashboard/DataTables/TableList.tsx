import type { ReactNode } from "react";
import type { ProjectTable } from "@/types";
import { TableRow } from "./TableRow";
import styles from "./DataTables.module.scss";

interface TableListProps {
  tables: ProjectTable[];
  expandedTables: Set<string>;
  expandedVersions: Set<string>;
  onToggleTable: (id: string) => void;
  onToggleVersions: (id: string) => void;
}

export function TableList({
  tables,
  expandedTables,
  expandedVersions,
  onToggleTable,
  onToggleVersions,
}: TableListProps): ReactNode {
  return (
    <div className={styles.list}>
      {tables.map((table) => (
        <TableRow
          key={table.project_table_id}
          table={table}
          isExpanded={expandedTables.has(table.project_table_id)}
          isVersionsExpanded={expandedVersions.has(table.project_table_id)}
          onToggle={() => onToggleTable(table.project_table_id)}
          onToggleVersions={() => onToggleVersions(table.project_table_id)}
        />
      ))}
    </div>
  );
}

