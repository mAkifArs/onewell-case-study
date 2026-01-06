import type { ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import type { TableVersion } from "@/types";
import { formatDate, formatVersion, formatCompact, toTitleCase } from "@/utils";
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

  return (
    <div
      className={styles.versionHistory}
      data-testid={`version-history-${tableId}`}
    >
      <h4 className={styles.sectionTitle}>Version History</h4>
      <div className={styles.versions}>
        {sortedVersions.map((version) => (
          <div
            key={version.table_version_id}
            className={styles.versionItem}
            data-current={version.table_version_id === currentVersionId}
            data-testid={`version-item-${version.version_number}`}
          >
            <div className={styles.versionMain}>
              <span className={styles.versionNumber}>
                {formatVersion(version.version_number)}
              </span>
              {version.table_version_id === currentVersionId && (
                <span className={styles.currentBadge}>current</span>
              )}
            </div>

            <div className={styles.versionMeta}>
              <span>{formatCompact(version.row_count)} rows</span>
              <span>•</span>
              <span>{formatDate(version.created_at)}</span>
              {version.checkpoint_type && (
                <>
                  <span>•</span>
                  <span className={styles.checkpointSmall}>
                    <CheckCircle size={10} />
                    {toTitleCase(version.checkpoint_type)}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

