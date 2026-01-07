import type { ReactNode } from "react";
import type { Operation } from "@/types";
import { toTitleCase } from "@/utils";
import styles from "./OperationsTimeline.module.scss";

interface OperationCardProps {
  operation: Operation;
}

export function OperationCard({ operation }: OperationCardProps): ReactNode {
  const tableDisplayName = toTitleCase(operation.affected_table);

  return (
    <div
      className={styles.operationCard}
      data-testid={`operation-card-${operation.operation_log_id}`}
    >
      <div className={styles.operationHeader}>
        <span className={styles.operationName}>
          {toTitleCase(operation.operation_name)}
        </span>
      </div>

      <div className={styles.operationDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Operation Type</span>
          <span className={styles.detailValue}>{operation.operation_type}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Executed by</span>
          <span className={styles.detailValue}>
            {operation.executed_by.name}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Affected Table</span>
          <span className={styles.detailValue}>
            {tableDisplayName}{" "}
            <code className={styles.code}>{operation.affected_table}</code>
          </span>
        </div>
      </div>
    </div>
  );
}
