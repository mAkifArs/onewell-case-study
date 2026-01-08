import type { ReactNode } from "react";
import type { Column } from "@/types";
import { Badge } from "@/components/Badge";
import {
  DataTable,
  type DataTableColumn,
  dataTableStyles,
} from "@/components/DataTable";
import { formatColumnRole } from "@/utils";

interface ColumnListProps {
  columns: Column[];
  tableId: string;
}

const columnConfig: DataTableColumn<Column>[] = [
  {
    key: "display_name",
    header: "Column",
    render: (col) => (
      <span className={dataTableStyles.cellPrimary}>{col.display_name}</span>
    ),
  },
  {
    key: "column_name",
    header: "Name",
    render: (col) => (
      <span className={dataTableStyles.cellPrimary}>{col.column_name}</span>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (col) => (
      <Badge variant={col.role} data-testid={`column-role-badge-${col.role}`}>
        {formatColumnRole(col.role)}
      </Badge>
    ),
  },
];

export function ColumnList({ columns, tableId }: ColumnListProps): ReactNode {
  return (
    <DataTable
      columns={columnConfig}
      data={columns}
      getRowKey={(col) => col.column_id}
      testId={`column-list-${tableId}`}
    />
  );
}
