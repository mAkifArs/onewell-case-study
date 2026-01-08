import type { Column } from "@/types";
import { Badge } from "@/components/Badge";
import { type DataTableColumn, dataTableStyles } from "@/components/DataTable";
import { formatColumnRole } from "@/utils";

export const columnListColumns: DataTableColumn<Column>[] = [
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

