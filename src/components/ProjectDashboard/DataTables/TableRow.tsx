import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, History, CheckCircle } from "lucide-react";
import type { ProjectTable } from "@/types";
import { expandAnimation } from "@/constants";
import { Modal } from "@/components/Modal";
import { TableIndicator } from "@/components/TableIndicator";
import { formatCompact, formatVersion, toTitleCase } from "@/utils";
import { ColumnList } from "./ColumnList/ColumnList";
import { VersionHistory } from "./VersionHistory/VersionHistory";
import styles from "./DataTables.module.scss";

interface TableRowProps {
  table: ProjectTable;
  isExpanded: boolean;
  onToggle: () => void;
}

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
      {/* Header row */}
      <div className={styles.tableHeader}>
        <ExpandButton
          isExpanded={isExpanded}
          onToggle={onToggle}
          tableId={table.project_table_id}
        />

        <div className={styles.tableInfo}>
          <div className={styles.tableName}>
            <TableIndicator
              displayName={table.display_name}
              tableName={table.table_name}
              variant="inline"
            />
          </div>

          <TableMeta
            tableType={table.table_type}
            rowCount={currentVersion?.row_count ?? 0}
            columnCount={currentVersion?.column_count ?? 0}
            checkpointType={
              hasCheckpoint ? currentVersion?.checkpoint_type : null
            }
          />
        </div>

        <VersionButton
          versionNumber={currentVersion?.version_number ?? 1}
          onClick={() => setIsVersionsOpen(true)}
        />
      </div>

      {/* Expanded content */}
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

      {/* Version history modal */}
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

// ─────────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

interface ExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  tableId: string;
}

function ExpandButton({
  isExpanded,
  onToggle,
  tableId,
}: ExpandButtonProps): ReactNode {
  return (
    <button
      className={styles.expandButton}
      onClick={onToggle}
      aria-expanded={isExpanded}
      data-testid={`table-expand-btn-${tableId}`}
    >
      <motion.span
        animate={{ rotate: isExpanded ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: "flex" }}
      >
        <ChevronRight size={16} />
      </motion.span>
    </button>
  );
}

interface TableMetaProps {
  tableType: string;
  rowCount: number;
  columnCount: number;
  checkpointType: string | null | undefined;
}

function TableMeta({
  tableType,
  rowCount,
  columnCount,
  checkpointType,
}: TableMetaProps): ReactNode {
  return (
    <div className={styles.tableMeta}>
      <span className={styles.tableType} data-type={tableType}>
        {tableType}
      </span>
      <span className={styles.metaSeparator}>·</span>
      <span className={styles.stats}>{formatCompact(rowCount)} rows</span>
      <span className={styles.metaSeparator}>·</span>
      <span className={styles.stats}>{columnCount} cols</span>
      {checkpointType && (
        <>
          <span className={styles.metaSeparator}>·</span>
          <span
            className={styles.checkpoint}
            data-testid={`checkpoint-badge-${checkpointType}`}
          >
            <CheckCircle size={12} />
            {toTitleCase(checkpointType)}
          </span>
        </>
      )}
    </div>
  );
}

interface VersionButtonProps {
  versionNumber: number;
  onClick: () => void;
}

function VersionButton({
  versionNumber,
  onClick,
}: VersionButtonProps): ReactNode {
  return (
    <button
      className={styles.versionButton}
      onClick={onClick}
      aria-label="Version history"
    >
      <span className={styles.versionLabel}>
        {formatVersion(versionNumber)}
      </span>
      <History size={14} />
    </button>
  );
}
