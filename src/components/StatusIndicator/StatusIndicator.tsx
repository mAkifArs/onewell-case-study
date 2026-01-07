import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./StatusIndicator.module.scss";

type StatusVariant =
  | "draft"
  | "active"
  | "review"
  | "approved"
  | "locked";

type Size = "sm" | "md";

interface StatusIndicatorProps {
  /** The status to display */
  status: string;
  /** Color variant */
  variant?: StatusVariant;
  /** Size of the indicator */
  size?: Size;
  /** Optional className */
  className?: string;
  /** Test ID */
  "data-testid"?: string;
}

export function StatusIndicator({
  status,
  variant,
  size = "md",
  className,
  "data-testid": testId,
}: StatusIndicatorProps): ReactNode {
  const statusVariant = variant ?? (status.toLowerCase() as StatusVariant);

  return (
    <span
      className={clsx(styles.status, styles[size], className)}
      data-testid={testId}
    >
      <span className={clsx(styles.dot, styles[statusVariant])} />
      {status}
    </span>
  );
}

