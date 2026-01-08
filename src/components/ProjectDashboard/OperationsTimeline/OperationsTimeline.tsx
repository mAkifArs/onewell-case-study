import { memo, type ReactNode } from "react";
import { useDashboardOperationsGrouped } from "@/hooks";
import { EmptyState } from "@/components/EmptyState";
import { DateGroup } from "./DateGroup";
import styles from "./OperationsTimeline.module.scss";

/**
 * Operations timeline component - uses store directly via hook.
 * The hook handles data transformation (grouping by date).
 * Only re-renders when operations data changes.
 */
export const OperationsTimeline = memo(
  function OperationsTimeline(): ReactNode {
    const groups = useDashboardOperationsGrouped();

    if (groups.length === 0) {
      return <EmptyState message="No recent operations" />;
    }

    return (
      <div className={styles.timeline} data-testid="operations-timeline">
        {groups.map((group) => (
          <DateGroup
            key={group.date}
            date={group.date}
            operations={group.operations}
          />
        ))}
      </div>
    );
  }
);
