import type { ReactNode } from "react";
import type { LineageRelation, ProjectTable } from "@/types";
import { EmptyState } from "@/components/EmptyState";
import { LineageFlow } from "./LineageFlow";
import styles from "./DataLineage.module.scss";

interface DataLineageProps {
  lineage: LineageRelation[];
  tables: ProjectTable[];
}

export function DataLineage({ lineage, tables }: DataLineageProps): ReactNode {
  if (lineage.length === 0) {
    return <EmptyState message="No lineage data available" />;
  }

  return (
    <div className={styles.container} data-testid="lineage-view">
      <LineageFlow lineage={lineage} tables={tables} />
    </div>
  );
}
