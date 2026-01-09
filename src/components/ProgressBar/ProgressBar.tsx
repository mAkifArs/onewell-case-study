import { useMemo, type ReactNode } from "react";
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

// CSS variables for gradient colors (theme-aware)
const GRADIENT_COLORS = {
  low: "var(--color-error)", // red/coral
  mid: "var(--color-warning)", // gold
  high: "var(--color-success)", // green
} as const;

function getGradientColor(value: number): string {
  // Red (low) → Gold (mid) → Green (high)
  if (value < 33) {
    return GRADIENT_COLORS.low;
  } else if (value < 67) {
    return GRADIENT_COLORS.mid;
  } else {
    return GRADIENT_COLORS.high;
  }
}

/**
 * Progress bar component with optional gradient coloring.
 */
export function ProgressBar({
  value,
  showLabel = true,
  colorMode = "default",
  className,
  "data-testid": testId = "progress-bar",
}: ProgressBarProps): ReactNode {
  const clampedValue = useMemo(
    () => Math.min(100, Math.max(0, value)),
    [value]
  );

  const fillStyle = useMemo<React.CSSProperties>(
    () => ({
      width: `${clampedValue}%`,
      ...(colorMode === "gradient" && {
        backgroundColor: getGradientColor(clampedValue),
      }),
    }),
    [clampedValue, colorMode]
  );

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
