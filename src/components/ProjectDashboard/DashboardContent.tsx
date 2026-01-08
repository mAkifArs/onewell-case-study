import { memo, type ReactNode } from "react";
import { PanelInfo } from "@/constants";
import { Panel } from "@/components/Panel";
import { ProjectHeader } from "./ProjectHeader";
import { DataTables } from "./DataTables";
import { OperationsTimeline } from "./OperationsTimeline";
import { Governance } from "./Governance";
import { DataLineage } from "./DataLineage";
import styles from "./ProjectDashboard.module.scss";

/**
 * Dashboard content layout.
 * Each panel component fetches its own data from the store.
 */
export const DashboardContent = memo(function DashboardContent(): ReactNode {
  return (
    <>
      <ProjectHeader />

      <div className={styles.mainGrid}>
        <Panel
          title="Data Tables"
          info={PanelInfo.DATA_TABLES}
          data-testid="data-tables-panel"
          className={styles.tallPanel}
        >
          <DataTables />
        </Panel>

        <Panel
          title="Recent Operations"
          info={PanelInfo.OPERATIONS}
          data-testid="operations-panel"
          className={styles.tallPanel}
        >
          <OperationsTimeline />
        </Panel>
      </div>

      <div className={styles.secondaryGrid}>
        <Panel
          title="Governance"
          info={PanelInfo.GOVERNANCE}
          data-testid="governance-panel"
        >
          <Governance />
        </Panel>

        <Panel
          title="Data Lineage"
          info={PanelInfo.LINEAGE}
          data-testid="lineage-panel"
        >
          <DataLineage />
        </Panel>
      </div>
    </>
  );
});
