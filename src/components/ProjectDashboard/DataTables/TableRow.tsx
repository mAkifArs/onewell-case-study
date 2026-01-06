import type { ReactNode } from "react";
import { ChevronDown, ChevronRight, History, CheckCircle } from "lucide-react";
import type { ProjectTable } from "@/types";
import { Badge } from "@/components/Badge";
import { formatCompact, formatVersion, toTitleCase } from "@/utils";
import { ColumnList } from "./ColumnList";
import { VersionHistory } from "./VersionHistory";
import styles from "./DataTables.module.scss";

interface TableRowProps {
  table: ProjectTable;
  isExpanded: boolean;
  isVersionsExpanded: boolean;
  onToggle: () => void;
  onToggleVersions: () => void;
}

export function TableRow({
  table,
  isExpanded,
  isVersionsExpanded,
  onToggle,
  onToggleVersions,
}: TableRowProps): ReactNode {
  const currentVersion = table.versions.find(
    (v) => v.table_version_id === table.current_version_id
  );

  const hasCheckpoint = currentVersion?.checkpoint_type !== null;

  return (
    <div
      className={styles.tableRow}
      data-testid={`table-row-${table.project_table_id}`}
    >
      <div className={styles.tableHeader}>
        <button
          className={styles.expandButton}
          onClick={onToggle}
          aria-expanded={isExpanded}
          data-testid={`table-expand-btn-${table.project_table_id}`}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className={styles.tableInfo}>
          <div className={styles.tableName}>
            <span className={styles.name}>{table.display_name}</span>
            <code className={styles.code}>{table.table_name}</code>
          </div>

          <div className={styles.tableMeta}>
            <Badge variant={table.table_type === "source" ? "default" : "ml"}>
              {table.table_type}
            </Badge>
            <span className={styles.version}>
              {formatVersion(currentVersion?.version_number ?? 1)}
            </span>
            <span className={styles.stats}>
              {formatCompact(currentVersion?.row_count ?? 0)} rows
            </span>
            <span className={styles.stats}>
              {currentVersion?.column_count ?? 0} cols
            </span>
            {hasCheckpoint && (
              <span
                className={styles.checkpoint}
                data-testid={`checkpoint-badge-${currentVersion?.checkpoint_type}`}
              >
                <CheckCircle size={12} />
                {toTitleCase(currentVersion?.checkpoint_type ?? "")}
              </span>
            )}
          </div>
        </div>

        <button
          className={styles.historyButton}
          onClick={onToggleVersions}
          title="Version history"
        >
          <History size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <ColumnList
            columns={table.columns}
            tableId={table.project_table_id}
          />
        </div>
      )}

      {isVersionsExpanded && (
        <div className={styles.expandedContent}>
          <VersionHistory
            versions={table.versions}
            currentVersionId={table.current_version_id}
            tableId={table.project_table_id}
          />
        </div>
      )}
    </div>
  );
}

