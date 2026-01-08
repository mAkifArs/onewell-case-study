import { memo, useMemo, type ReactNode } from "react";
import type { Operation } from "@/types";
import { getOperationStyle } from "@/constants";
import { toTitleCase } from "@/utils";
import { formatTime } from "@/utils/dateUtils";
import { LabelValue } from "@/components/LabelValue";
import { TableIndicator } from "@/components/TableIndicator";
import styles from "./OperationsTimeline.module.scss";

interface OperationCardProps {
  operation: Operation;
}

/**
 * Operation card component - displays a single operation.
 * Memoized to prevent re-renders when parent re-renders.
 */
export const OperationCard = memo(function OperationCard({
  operation,
}: OperationCardProps): ReactNode {
  const time = formatTime(operation.execution_timestamp);
  const config = getOperationStyle(operation.operation_name);

  // Map operation data to label-value items
  const detailItems = useMemo(
    () => [
      { label: "Type", value: toTitleCase(operation.operation_type) },
      { label: "By", value: operation.executed_by.name },
      {
        label: "Table",
        value: <TableIndicator tableName={operation.affected_table} />,
      },
    ],
    [operation]
  );

  return (
    <div
      className={styles.operationCard}
      data-testid={`operation-card-${operation.operation_log_id}`}
    >
      <OperationIcon config={config} />

      <div className={styles.operationContent}>
        <OperationHeader
          name={toTitleCase(operation.operation_name)}
          time={time}
        />

        <div className={styles.operationDetails}>
          {detailItems.map((item) => (
            <LabelValue
              key={item.label}
              label={item.label}
              value={item.value}
              variant="inline"
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

interface OperationIconProps {
  config: ReturnType<typeof getOperationStyle>;
}

function OperationIcon({ config }: OperationIconProps): ReactNode {
  const Icon = config.icon;

  return (
    <div
      className={styles.iconWrapper}
      style={
        {
          "--icon-color": config.color,
          "--icon-bg": config.bgColor,
        } as React.CSSProperties
      }
    >
      <Icon size={16} strokeWidth={2} />
    </div>
  );
}

interface OperationHeaderProps {
  name: string;
  time: string;
}

function OperationHeader({ name, time }: OperationHeaderProps): ReactNode {
  return (
    <div className={styles.operationHeader}>
      <span className={styles.operationName}>{name}</span>
      <span className={styles.operationTime}>{time}</span>
    </div>
  );
}
