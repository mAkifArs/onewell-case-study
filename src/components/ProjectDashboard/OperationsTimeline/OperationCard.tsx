import { useMemo, type ReactNode } from "react";
import type { Operation } from "@/types";
import { toTitleCase } from "@/utils";
import { formatTime } from "@/utils/dateUtils";
import { LabelValue } from "@/components/LabelValue";
import { TableIndicator } from "@/components/TableIndicator";
import {
  Upload,
  GitMerge,
  FunctionSquare,
  FilterX,
  Divide,
  Layers,
  History,
  TrendingUp,
  Cog,
  type LucideIcon,
} from "lucide-react";
import styles from "./OperationsTimeline.module.scss";

interface OperationCardProps {
  operation: Operation;
}

// Map operation names to icons and colors
const operationConfig: Record<
  string,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  upload_data: {
    icon: Upload,
    color: "var(--op-color-upload)",
    bgColor: "var(--op-bg-upload)",
  },
  merge_tables: {
    icon: GitMerge,
    color: "var(--op-color-merge)",
    bgColor: "var(--op-bg-merge)",
  },
  log_transform: {
    icon: FunctionSquare,
    color: "var(--op-color-transform)",
    bgColor: "var(--op-bg-transform)",
  },
  remove_nulls: {
    icon: FilterX,
    color: "var(--op-color-clean)",
    bgColor: "var(--op-bg-clean)",
  },
  create_ratio: {
    icon: Divide,
    color: "var(--op-color-calculate)",
    bgColor: "var(--op-bg-calculate)",
  },
  aggregate: {
    icon: Layers,
    color: "var(--op-color-aggregate)",
    bgColor: "var(--op-bg-aggregate)",
  },
  create_lag: {
    icon: History,
    color: "var(--op-color-timeseries)",
    bgColor: "var(--op-bg-timeseries)",
  },
  moving_average: {
    icon: TrendingUp,
    color: "var(--op-color-timeseries)",
    bgColor: "var(--op-bg-timeseries)",
  },
};

const defaultConfig = {
  icon: Cog,
  color: "var(--op-color-default)",
  bgColor: "var(--op-bg-default)",
};

export function OperationCard({ operation }: OperationCardProps): ReactNode {
  const time = formatTime(operation.execution_timestamp);
  const config = operationConfig[operation.operation_name] ?? defaultConfig;
  const Icon = config.icon;

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
      {/* Icon Column */}
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

      {/* Content Column */}
      <div className={styles.operationContent}>
        <div className={styles.operationHeader}>
          <span className={styles.operationName}>
            {toTitleCase(operation.operation_name)}
          </span>
          <span className={styles.operationTime}>{time}</span>
        </div>

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
}
