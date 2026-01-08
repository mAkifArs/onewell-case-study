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

// Panel info descriptions
const PANEL_INFO = {
  dataTables:
    "View all source and derived tables in this project. Expand rows to see column details with their roles. Click version history to see table evolution.",
  operations:
    "Timeline of recent data transformations and operations performed on project tables, grouped by date.",
  governance:
    "Track approval workflows, compliance checklist progress, and project stakeholders.",
  lineage:
    "Visual representation of data flow. Source tables on the left feed into derived tables on the right. Click a table to highlight its upstream dependencies.",
};

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
          info={PANEL_INFO.dataTables}
          data-testid="data-tables-panel"
          className={styles.tallPanel}
        >
          <DataTables tables={tables} />
        </Panel>

        <Panel
          title="Recent Operations"
          info={PANEL_INFO.operations}
          data-testid="operations-panel"
          className={styles.tallPanel}
        >
          <OperationsTimeline operations={operations} />
        </Panel>
      </div>

      <div className={styles.secondaryGrid}>
        <Panel
          title="Governance"
          info={PANEL_INFO.governance}
          data-testid="governance-panel"
        >
          <Governance governance={governance} />
        </Panel>

        <Panel
          title="Data Lineage"
          info={PANEL_INFO.lineage}
          data-testid="lineage-panel"
        >
          <DataLineage lineage={lineage} tables={tables} />
        </Panel>
      </div>
    </>
  );
}
