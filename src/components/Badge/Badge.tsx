import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Badge.module.scss";

type BadgeVariant =
  // Project status
  | "draft"
  | "active"
  | "review"
  | "approved"
  | "locked"
  // Project type
  | "ml"
  | "timeseries"
  | "scorecard"
  | "ai"
  // Column roles
  | "exog"
  | "endog"
  | "not_used"
  | "time_id"
  | "lookup"
  // Generic
  | "default"
  | "success"
  | "warning"
  | "error";

interface BadgeProps {
  /** Badge text */
  children: ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Optional className */
  className?: string;
  /** Test ID */
  "data-testid"?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
  "data-testid": testId,
}: BadgeProps): ReactNode {
  return (
    <span
      className={clsx(styles.badge, styles[variant], className)}
      data-testid={testId}
    >
      {children}
    </span>
  );
}

