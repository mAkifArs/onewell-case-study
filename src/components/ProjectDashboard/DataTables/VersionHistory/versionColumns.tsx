import { CheckCircle } from "lucide-react";
import type { TableVersion } from "@/types";
import { type DataTableColumn, dataTableStyles } from "@/components/DataTable";
import { formatDate, formatVersion, formatCompact, toTitleCase } from "@/utils";

/**
 * Column configuration for the version history table.
 * @param currentVersionId - ID of the current version to highlight
 */
export const getVersionColumns = (
  currentVersionId: string
): DataTableColumn<TableVersion>[] => [
  {
    key: "version",
    header: "Version",
    render: (v) => (
      <span className={dataTableStyles.cellWithBadge}>
        <span className={dataTableStyles.cellMono}>
          {formatVersion(v.version_number)}
        </span>
        {v.table_version_id === currentVersionId && (
          <span className={dataTableStyles.cellBadge}>current</span>
        )}
      </span>
    ),
  },
  {
    key: "rows",
    header: "Rows",
    render: (v) => formatCompact(v.row_count),
  },
  {
    key: "columns",
    header: "Columns",
    render: (v) => v.column_count,
  },
  {
    key: "created",
    header: "Created",
    render: (v) => formatDate(v.created_at),
  },
  {
    key: "author",
    header: "Author",
    render: (v) => v.created_by,
  },
  {
    key: "checkpoint",
    header: "Checkpoint",
    render: (v) =>
      v.checkpoint_type ? (
        <span className={dataTableStyles.cellSuccess}>
          <CheckCircle size={12} />
          {toTitleCase(v.checkpoint_type)}
        </span>
      ) : (
        <span className={dataTableStyles.cellMuted}>—</span>
      ),
  },
];

