import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, History, CheckCircle } from "lucide-react";
import type { ProjectTable } from "@/types";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { Tooltip } from "@/components/Tooltip";
import { formatCompact, formatVersion, toTitleCase } from "@/utils";
import { ColumnList } from "./ColumnList";
import { VersionHistory } from "./VersionHistory";
import styles from "./DataTables.module.scss";

interface TableRowProps {
  table: ProjectTable;
  isExpanded: boolean;
  onToggle: () => void;
}

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

export function TableRow({
  table,
  isExpanded,
  onToggle,
}: TableRowProps): ReactNode {
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
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
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex" }}
          >
            <ChevronRight size={16} />
          </motion.span>
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

        <Tooltip content="View version history" position="top">
          <button
            className={styles.historyButton}
            onClick={() => setIsVersionsOpen(true)}
            aria-label="Version history"
          >
            <History size={14} />
          </button>
        </Tooltip>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div className={styles.expandedContent} {...expandAnimation}>
            <ColumnList
              columns={table.columns}
              tableId={table.project_table_id}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        title={`Version History — ${table.display_name}`}
        size="wide"
      >
        <VersionHistory
          versions={table.versions}
          currentVersionId={table.current_version_id}
          tableId={table.project_table_id}
        />
      </Modal>
    </div>
  );
}
