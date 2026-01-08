import type { ReactNode } from "react";
import styles from "./LabelValue.module.scss";

interface LabelValueProps {
  label: string;
  value: ReactNode;
  /** Visual variant */
  variant?: "default" | "inline" | "stacked";
  /** Additional class name */
  className?: string;
}

/**
 * Reusable label-value pair component.
 * Used for meta info, details, and key-value displays.
 */
export function LabelValue({
  label,
  value,
  variant = "default",
  className,
}: LabelValueProps): ReactNode {
  if (value === null || value === undefined) return null;

  return (
    <div className={`${styles.container} ${styles[variant]} ${className ?? ""}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

