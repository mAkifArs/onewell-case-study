import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  /** Width (e.g., "100%", "200px") */
  width?: string;
  /** Height (e.g., "1rem", "40px") */
  height?: string;
  /** Border radius variant */
  variant?: "text" | "rectangular" | "circular";
  /** Optional className */
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  variant = "text",
  className,
}: SkeletonProps): ReactNode {
  return (
    <div
      className={clsx(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
      data-testid="loading-skeleton"
    />
  );
}
