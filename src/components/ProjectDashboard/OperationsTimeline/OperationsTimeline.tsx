import type { ReactNode } from "react";
import type { Operation } from "@/types";
import { getDateGroupKey } from "@/utils";
import { DateGroup } from "./DateGroup";
import styles from "./OperationsTimeline.module.scss";

interface OperationsTimelineProps {
  operations: Operation[];
}

interface GroupedOperations {
  date: string;
  operations: Operation[];
}

function groupByDate(operations: Operation[]): GroupedOperations[] {
  const groups = new Map<string, Operation[]>();

  for (const op of operations) {
    const key = getDateGroupKey(op.execution_timestamp);
    const existing = groups.get(key) ?? [];
    groups.set(key, [...existing, op]);
  }

  return Array.from(groups.entries()).map(([date, ops]) => ({
    date,
    operations: ops,
  }));
}

export function OperationsTimeline({
  operations,
}: OperationsTimelineProps): ReactNode {
  if (operations.length === 0) {
    return <p className={styles.empty}>No recent operations</p>;
  }

  const grouped = groupByDate(operations);

  return (
    <div className={styles.timeline} data-testid="operations-timeline">
      {grouped.map((group) => (
        <DateGroup
          key={group.date}
          date={group.date}
          operations={group.operations}
        />
      ))}
    </div>
  );
}

