import { memo, type ReactNode } from "react";
import type { Operation } from "@/types";
import { OperationCard } from "./OperationCard";
import styles from "./OperationsTimeline.module.scss";

interface DateGroupProps {
  date: string;
  operations: Operation[];
}

/**
 * Date group component - renders operations for a single date.
 * Memoized to prevent re-renders when parent re-renders.
 */
export const DateGroup = memo(function DateGroup({
  date,
  operations,
}: DateGroupProps): ReactNode {
  return (
    <div className={styles.dateGroup} data-testid={`date-group-${date}`}>
      <div className={styles.dateHeader}>
        <span className={styles.dateLine} />
        <span className={styles.dateLabel}>{date}</span>
        <span className={styles.dateLine} />
      </div>

      <div className={styles.operations}>
        {operations.map((op) => (
          <OperationCard key={op.operation_log_id} operation={op} />
        ))}
      </div>
    </div>
  );
});
