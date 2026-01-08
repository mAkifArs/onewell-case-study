import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./TableIndicator.module.scss";

interface TableIndicatorProps {
  /** The display name (e.g., "Customer Purchases") */
  displayName?: string;
  /** The technical table name (e.g., "customer_transactions") */
  tableName: string;
  /** Layout variant: inline (horizontal) or stacked (vertical) */
  variant?: "inline" | "stacked";
  /** Size: small (for lineage nodes), default, or large */
  size?: "small" | "default" | "large";
  /** Whether to truncate long names with ellipsis */
  truncate?: boolean;
  /** Custom class name */
  className?: string;
}

export function TableIndicator({
  displayName,
  tableName,
  variant = "inline",
  size = "default",
  truncate = false,
  className,
}: TableIndicatorProps): ReactNode {
  const showDisplayName = displayName && displayName !== tableName;

  return (
    <span
      className={clsx(
        styles.indicator,
        styles[variant],
        styles[size],
        truncate && styles.truncate,
        className
      )}
    >
      {showDisplayName && (
        <span className={styles.displayName}>{displayName}</span>
      )}
      <code className={styles.code}>{tableName}</code>
    </span>
  );
}
