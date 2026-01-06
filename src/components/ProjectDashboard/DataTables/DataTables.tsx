import type { ReactNode } from "react";
import { useState } from "react";
import type { ProjectTable } from "@/types";
import { TableRow } from "./TableRow";
import styles from "./DataTables.module.scss";

interface DataTablesProps {
  tables: ProjectTable[];
}

export function DataTables({ tables }: DataTablesProps): ReactNode {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const toggleTable = (id: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleVersions = (id: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (tables.length === 0) {
    return <p className={styles.empty}>No tables in this project</p>;
  }

  return (
    <div className={styles.list}>
      {tables.map((table) => (
        <TableRow
          key={table.project_table_id}
          table={table}
          isExpanded={expandedTables.has(table.project_table_id)}
          isVersionsExpanded={expandedVersions.has(table.project_table_id)}
          onToggle={() => toggleTable(table.project_table_id)}
          onToggleVersions={() => toggleVersions(table.project_table_id)}
        />
      ))}
    </div>
  );
}

