import type { ReactNode } from "react";
import type {
  Project,
  ProjectTable,
  Operation,
  Governance as GovernanceType,
  LineageRelation,
} from "@/types";
import { Panel } from "@/components/Panel";
import { ProjectHeader } from "./ProjectHeader";
import { DataTables } from "./DataTables";
import { OperationsTimeline } from "./OperationsTimeline";
import { Governance } from "./Governance";
import { DataLineage } from "./DataLineage";
import styles from "./ProjectDashboard.module.scss";

interface DashboardContentProps {
  project: Project;
  tables: ProjectTable[];
  operations: Operation[];
  governance: GovernanceType | null;
  lineage: LineageRelation[];
}

export function DashboardContent({
  project,
  tables,
  operations,
  governance,
  lineage,
}: DashboardContentProps): ReactNode {
  return (
    <>
      <ProjectHeader project={project} />

      <div className={styles.mainGrid}>
        <Panel
          title="Data Tables"
          data-testid="data-tables-panel"
          className={styles.tallPanel}
        >
          <DataTables tables={tables} />
        </Panel>

        <Panel
          title="Recent Operations"
          data-testid="operations-panel"
          className={styles.tallPanel}
        >
          <OperationsTimeline operations={operations} />
        </Panel>
      </div>

      <div className={styles.secondaryGrid}>
        <Panel title="Governance" data-testid="governance-panel">
          <Governance governance={governance} />
        </Panel>

        <Panel title="Data Lineage" data-testid="lineage-panel">
          <DataLineage lineage={lineage} tables={tables} />
        </Panel>
      </div>
    </>
  );
}
