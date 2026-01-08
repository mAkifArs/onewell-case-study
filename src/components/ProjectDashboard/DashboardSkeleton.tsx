import type { ReactNode } from "react";
import { Skeleton } from "@/components/Skeleton";
import styles from "./ProjectDashboard.module.scss";

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: ProjectHeader
// ─────────────────────────────────────────────────────────────────────────────

function HeaderSkeleton(): ReactNode {
  return (
    <div className={styles.headerSkeleton}>
      {/* Top section: Title, Status, Type, Objectives */}
      <div className={styles.headerTop}>
        <div className={styles.headerTitleRow}>
          <Skeleton width="280px" height="1.75rem" />
          <Skeleton width="80px" height="1.5rem" variant="rectangular" />
        </div>
        <Skeleton width="100px" height="0.75rem" />
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="70%" height="1rem" />
      </div>

      {/* Meta section */}
      <div className={styles.headerMeta}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.headerMetaItem}>
            <Skeleton width="60px" height="0.625rem" />
            <Skeleton width="100px" height="0.875rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Panel with content
// ─────────────────────────────────────────────────────────────────────────────

interface PanelSkeletonProps {
  children?: ReactNode;
  className?: string;
}

function PanelSkeleton({ children, className }: PanelSkeletonProps): ReactNode {
  return (
    <div className={`${styles.panelSkeleton} ${className ?? ""}`}>
      <div className={styles.panelSkeletonHeader}>
        <Skeleton width="120px" height="1rem" />
        <Skeleton width="20px" height="20px" variant="circular" />
      </div>
      <div className={styles.panelSkeletonContent}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Data Tables panel content
// ─────────────────────────────────────────────────────────────────────────────

function TableRowSkeleton(): ReactNode {
  return (
    <div className={styles.tableRowSkeleton}>
      <Skeleton width="16px" height="16px" variant="circular" />
      <div className={styles.tableRowInfo}>
        <div className={styles.tableRowName}>
          <Skeleton width="140px" height="1rem" />
          <Skeleton width="100px" height="0.75rem" />
        </div>
        <div className={styles.tableRowMeta}>
          <Skeleton width="50px" height="0.625rem" />
          <Skeleton width="60px" height="0.625rem" />
          <Skeleton width="50px" height="0.625rem" />
        </div>
      </div>
      <Skeleton width="60px" height="1.5rem" variant="rectangular" />
    </div>
  );
}

function DataTablesSkeleton(): ReactNode {
  return (
    <div className={styles.tableListSkeleton}>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Operations panel content
// ─────────────────────────────────────────────────────────────────────────────

function OperationCardSkeleton(): ReactNode {
  return (
    <div className={styles.operationCardSkeleton}>
      <Skeleton width="100px" height="1rem" />
      <div className={styles.operationDetails}>
        <Skeleton width="60%" height="0.75rem" />
        <Skeleton width="50%" height="0.75rem" />
        <Skeleton width="70%" height="0.75rem" />
      </div>
    </div>
  );
}

function OperationsSkeleton(): ReactNode {
  return (
    <div className={styles.operationsSkeleton}>
      {/* Date group 1 */}
      <div className={styles.dateGroupSkeleton}>
        <Skeleton width="100px" height="0.75rem" />
        <OperationCardSkeleton />
        <OperationCardSkeleton />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Governance panel content
// ─────────────────────────────────────────────────────────────────────────────

function GovernanceSkeleton(): ReactNode {
  return (
    <div className={styles.governanceSkeleton}>
      {/* Approvals */}
      <div className={styles.governanceSection}>
        <Skeleton width="80px" height="0.875rem" />
        <div className={styles.approvalSkeleton}>
          <div className={styles.approvalRow}>
            <Skeleton width="100px" height="0.875rem" />
            <Skeleton width="70px" height="1.25rem" variant="rectangular" />
          </div>
          <Skeleton width="180px" height="0.75rem" />
        </div>
      </div>

      {/* Compliance */}
      <div className={styles.governanceSection}>
        <Skeleton width="80px" height="0.875rem" />
        <div className={styles.complianceSkeleton}>
          <Skeleton width="180px" height="0.875rem" />
          <Skeleton width="100%" height="0.5rem" variant="rectangular" />
          <Skeleton width="100px" height="0.75rem" />
        </div>
      </div>

      {/* Stakeholders */}
      <div className={styles.governanceSection}>
        <Skeleton width="80px" height="0.875rem" />
        <div className={styles.stakeholdersSkeleton}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.stakeholderSkeleton}>
              <Skeleton width="32px" height="32px" variant="circular" />
              <div>
                <Skeleton width="100px" height="0.875rem" />
                <Skeleton width="80px" height="0.625rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Lineage panel content
// ─────────────────────────────────────────────────────────────────────────────

function LineageSkeleton(): ReactNode {
  return (
    <div className={styles.lineageSkeleton}>
      {/* Source nodes */}
      <div className={styles.lineageColumn}>
        <Skeleton width="160px" height="50px" variant="rectangular" />
        <Skeleton width="160px" height="50px" variant="rectangular" />
      </div>
      {/* Connectors area */}
      <div className={styles.lineageConnectors} />
      {/* Derived node */}
      <div className={styles.lineageColumn}>
        <Skeleton width="160px" height="50px" variant="rectangular" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SKELETON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardSkeleton(): ReactNode {
  return (
    <>
      <HeaderSkeleton />

      <div className={styles.mainGrid}>
        <PanelSkeleton className={styles.tallPanelSkeleton}>
          <DataTablesSkeleton />
        </PanelSkeleton>
        <PanelSkeleton className={styles.tallPanelSkeleton}>
          <OperationsSkeleton />
        </PanelSkeleton>
      </div>

      <div className={styles.secondaryGrid}>
        <PanelSkeleton className={styles.secondaryPanelSkeleton}>
          <GovernanceSkeleton />
        </PanelSkeleton>
        <PanelSkeleton className={styles.secondaryPanelSkeleton}>
          <LineageSkeleton />
        </PanelSkeleton>
      </div>
    </>
  );
}
