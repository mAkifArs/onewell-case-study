import type { ReactNode } from "react";
import { useDashboardLineage } from "@/hooks";
import { EmptyState } from "@/components/EmptyState";
import { LineageFlow } from "./LineageFlow";
import styles from "./DataLineage.module.scss";

/**
 * Data lineage component - uses store directly.
 */
export function DataLineage(): ReactNode {
  const { lineage, tables } = useDashboardLineage();

  if (lineage.length === 0) {
    return <EmptyState message="No lineage data available" />;
  }

  return (
    <div className={styles.container} data-testid="lineage-view">
      <LineageFlow lineage={lineage} tables={tables} />
    </div>
  );
}
