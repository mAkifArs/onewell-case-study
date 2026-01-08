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

export interface OperationStyle {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

/**
 * Map operation names to their visual configuration (icon, colors).
 * Used in OperationCard for consistent styling.
 */
export const OperationConfig: Record<string, OperationStyle> = {
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
} as const;

export const DefaultOperationStyle: OperationStyle = {
  icon: Cog,
  color: "var(--op-color-default)",
  bgColor: "var(--op-bg-default)",
};

/**
 * Get operation style config by operation name.
 * Returns default config if operation name is not found.
 */
export function getOperationStyle(operationName: string): OperationStyle {
  return OperationConfig[operationName] ?? DefaultOperationStyle;
}
