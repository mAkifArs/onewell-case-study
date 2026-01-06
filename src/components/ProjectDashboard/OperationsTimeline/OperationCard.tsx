import type { ReactNode } from "react";
import { Play } from "lucide-react";
import type { Operation } from "@/types";
import { toTitleCase } from "@/utils";
import styles from "./OperationsTimeline.module.scss";

interface OperationCardProps {
  operation: Operation;
}

export function OperationCard({ operation }: OperationCardProps): ReactNode {
  return (
    <div
      className={styles.operationCard}
      data-testid={`operation-card-${operation.operation_log_id}`}
    >
      <div className={styles.operationIcon}>
        <Play size={12} />
      </div>

      <div className={styles.operationContent}>
        <div className={styles.operationMain}>
          <span className={styles.operationName}>
            {toTitleCase(operation.operation_name)}
          </span>
          <span className={styles.operationType}>{operation.operation_type}</span>
        </div>

        <div className={styles.operationMeta}>
          <span className={styles.executor}>{operation.executed_by.name}</span>
          <span className={styles.separator}>→</span>
          <code className={styles.affectedTable}>{operation.affected_table}</code>
        </div>
      </div>
    </div>
  );
}

