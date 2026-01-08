import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./ProgressBar.module.scss";

type ColorMode = "default" | "gradient";

interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Color mode: 'default' uses navy, 'gradient' uses red→yellow→green based on value */
  colorMode?: ColorMode;
  /** Optional className */
  className?: string;
  /** Test ID */
  "data-testid"?: string;
}

function getGradientColor(value: number): string {
  // Red (low) → Gold (mid) → Green (high)
  if (value < 33) {
    return "#ef4444"; // coral/red
  } else if (value < 67) {
    return "#d4a00a"; // gold
  } else {
    return "#10b981"; // green/success
  }
}

export function ProgressBar({
  value,
  showLabel = true,
  colorMode = "default",
  className,
  "data-testid": testId = "progress-bar",
}: ProgressBarProps): ReactNode {
  const clampedValue = Math.min(100, Math.max(0, value));

  const fillStyle: React.CSSProperties = {
    width: `${clampedValue}%`,
    ...(colorMode === "gradient" && {
      backgroundColor: getGradientColor(clampedValue),
    }),
  };

  return (
    <div className={clsx(styles.container, className)} data-testid={testId}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={fillStyle}
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
