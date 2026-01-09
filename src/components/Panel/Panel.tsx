import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Info } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";
import styles from "./Panel.module.scss";

interface PanelProps {
  /** Panel title */
  title: string;
  /** Panel content */
  children: ReactNode;
  /** Optional info tooltip content */
  info?: string;
  /** Optional className */
  className?: string;
  /** Test ID for E2E tests */
  "data-testid"?: string;
}

/**
 * Panel wrapper component with title and optional info tooltip.
 */
export function Panel({
  title,
  children,
  info,
  className,
  "data-testid": testId,
}: PanelProps): ReactNode {
  return (
    <section className={clsx(styles.panel, className)} data-testid={testId}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {info && (
          <Tooltip content={info}>
            <button className={styles.infoButton} aria-label={`${title} info`}>
              <Info size={14} />
            </button>
          </Tooltip>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
