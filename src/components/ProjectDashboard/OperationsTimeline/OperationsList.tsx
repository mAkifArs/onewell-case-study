import type { ReactNode } from "react";
import type { GroupedOperations } from "@/utils/operationUtils";
import { DateGroup } from "./DateGroup";
import styles from "./OperationsTimeline.module.scss";

interface OperationsListProps {
  groups: GroupedOperations[];
}

export function OperationsList({ groups }: OperationsListProps): ReactNode {
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

