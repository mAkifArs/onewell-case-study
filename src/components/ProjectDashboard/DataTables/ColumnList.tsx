import type { ReactNode } from "react";
import type { Column } from "@/types";
import { Badge } from "@/components/Badge";
import { formatColumnRole } from "@/utils";
import styles from "./DataTables.module.scss";

interface ColumnListProps {
  columns: Column[];
  tableId: string;
}

export function ColumnList({ columns, tableId }: ColumnListProps): ReactNode {
  return (
    <div className={styles.columnList} data-testid={`column-list-${tableId}`}>
      <h4 className={styles.sectionTitle}>Columns ({columns.length})</h4>
      <div className={styles.columns}>
        {columns.map((column) => (
          <div
            key={column.column_id}
            className={styles.columnItem}
            data-testid={`column-item-${column.column_name}`}
          >
            <code className={styles.columnName}>{column.column_name}</code>
            <span className={styles.columnType}>{column.data_type}</span>
            <Badge
              variant={column.role}
              data-testid={`column-role-badge-${column.role}`}
            >
              {formatColumnRole(column.role)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
