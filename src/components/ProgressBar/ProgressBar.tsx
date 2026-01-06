import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Optional className */
  className?: string;
  /** Test ID */
  "data-testid"?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  className,
  "data-testid": testId = "progress-bar",
}: ProgressBarProps): ReactNode {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx(styles.container, className)} data-testid={testId}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <span className={styles.label}>{clampedValue}%</span>}
    </div>
  );
}

