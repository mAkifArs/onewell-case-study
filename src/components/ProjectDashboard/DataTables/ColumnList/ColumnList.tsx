import type { ReactNode } from "react";
import type { Column } from "@/types";
import { DataTable } from "@/components/DataTable";
import { columnListColumns } from "./columnListColumns";

interface ColumnListProps {
  columns: Column[];
  tableId: string;
}

export function ColumnList({ columns, tableId }: ColumnListProps): ReactNode {
  return (
    <DataTable
      columns={columnListColumns}
      data={columns}
      getRowKey={(col) => col.column_id}
      testId={`column-list-${tableId}`}
    />
  );
}

