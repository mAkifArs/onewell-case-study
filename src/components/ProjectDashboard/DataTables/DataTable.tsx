import type { ReactNode } from "react";
import styles from "./DataTables.module.scss";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  isRowHighlighted?: (row: T) => boolean;
  testId?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  isRowHighlighted,
  testId,
}: DataTableProps<T>): ReactNode {
  return (
    <div className={styles.dataTableWrapper} data-testid={testId}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const highlighted = isRowHighlighted?.(row) ?? false;
            return (
              <tr key={getRowKey(row)} data-highlighted={highlighted}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

