import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Panel.module.scss";

interface PanelProps {
  /** Panel title */
  title: string;
  /** Panel content */
  children: ReactNode;
  /** Optional className */
  className?: string;
  /** Test ID for E2E tests */
  "data-testid"?: string;
}

export function Panel({
  title,
  children,
  className,
  "data-testid": testId,
}: PanelProps): ReactNode {
  return (
    <section className={clsx(styles.panel, className)} data-testid={testId}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
