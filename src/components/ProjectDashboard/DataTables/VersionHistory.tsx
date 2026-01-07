import type { ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import type { TableVersion } from "@/types";
import { formatDate, formatVersion, formatCompact, toTitleCase } from "@/utils";
import { DataTable, type DataTableColumn } from "./DataTable";
import styles from "./DataTables.module.scss";

interface VersionHistoryProps {
  versions: TableVersion[];
  currentVersionId: string;
  tableId: string;
}

export function VersionHistory({
  versions,
  currentVersionId,
  tableId,
}: VersionHistoryProps): ReactNode {
  // Sort by version number descending (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => b.version_number - a.version_number
  );

  const columnConfig: DataTableColumn<TableVersion>[] = [
    {
      key: "version",
      header: "Version",
      render: (v) => (
        <span className={styles.cellWithBadge}>
          <span className={styles.cellMono}>
            {formatVersion(v.version_number)}
          </span>
          {v.table_version_id === currentVersionId && (
            <span className={styles.cellBadge}>current</span>
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
          <span className={styles.cellSuccess}>
            <CheckCircle size={12} />
            {toTitleCase(v.checkpoint_type)}
          </span>
        ) : (
          <span className={styles.cellMuted}>—</span>
        ),
    },
  ];

  return (
    <DataTable
      columns={columnConfig}
      data={sortedVersions}
      getRowKey={(v) => v.table_version_id}
      isRowHighlighted={(v) => v.table_version_id === currentVersionId}
      testId={`version-history-${tableId}`}
    />
  );
}
