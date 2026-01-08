import { useMemo, type ReactNode } from "react";
import type { TableVersion } from "@/types";
import { DataTable } from "@/components/DataTable";
import { getVersionColumns } from "./versionColumns";

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
  const sortedVersions = useMemo(
    () => [...versions].sort((a, b) => b.version_number - a.version_number),
    [versions]
  );

  const columns = useMemo(
    () => getVersionColumns(currentVersionId),
    [currentVersionId]
  );

  return (
    <DataTable
      columns={columns}
      data={sortedVersions}
      getRowKey={(v) => v.table_version_id}
      isRowHighlighted={(v) => v.table_version_id === currentVersionId}
      testId={`version-history-${tableId}`}
    />
  );
}
