import type { ReactNode } from "react";
import clsx from "clsx";
import { Skeleton } from "@/components/Skeleton";
import styles from "./DashboardSkeleton.module.scss";

// Pre-computed arrays to avoid allocation on each render
const TABLE_ROWS = [0, 1, 2];
const STAKEHOLDER_ROWS = [0, 1, 2];

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: ProjectHeader
// ─────────────────────────────────────────────────────────────────────────────

function HeaderSkeleton(): ReactNode {
  return (
    <div className={styles.headerSkeleton}>
      {/* Top section: Title + badges, Objectives */}
      <div className={styles.headerTop}>
        <div className={styles.headerTitleRow}>
          <Skeleton width="320px" height="2rem" />
          <div className={styles.headerBadges}>
            <Skeleton width="70px" height="1.75rem" variant="rectangular" />
            <Skeleton width="80px" height="1.75rem" variant="rectangular" />
          </div>
        </div>
        <Skeleton width="100%" height="1.4rem" />
      </div>

      {/* Meta section */}
      <div className={styles.headerMeta}>
        <div className={styles.headerMetaItem}>
          <Skeleton width="40px" height="0.875rem" />
          <Skeleton width="75px" height="1.125rem" />
        </div>
        <div className={styles.headerMetaItem}>
          <Skeleton width="70px" height="0.875rem" />
          <Skeleton width="80px" height="1.125rem" />
        </div>
        <div className={styles.headerMetaItem}>
          <Skeleton width="70px" height="0.875rem" />
          <Skeleton width="140px" height="1.125rem" />
        </div>
        <div className={styles.headerMetaItem}>
          <Skeleton width="50px" height="0.875rem" />
          <Skeleton width="85px" height="1.125rem" />
        </div>
        <div className={styles.headerMetaItem}>
          <Skeleton width="52px" height="0.875rem" />
          <Skeleton width="85px" height="1.125rem" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Panel wrapper
// ─────────────────────────────────────────────────────────────────────────────

interface PanelSkeletonProps {
  children?: ReactNode;
  className?: string;
}

function PanelSkeleton({ children, className }: PanelSkeletonProps): ReactNode {
  return (
    <div className={clsx(styles.panelSkeleton, className)}>
      <div className={styles.panelSkeletonHeader}>
        <Skeleton width="130px" height="1.4rem" />
        <Skeleton width="20px" height="20px" variant="circular" />
      </div>
      <div className={styles.panelSkeletonContent}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Data Tables
// ─────────────────────────────────────────────────────────────────────────────

function TableRowSkeleton(): ReactNode {
  return (
    <div className={styles.tableRowSkeleton}>
      <Skeleton width="16px" height="16px" variant="circular" />
      <div className={styles.tableRowInfo}>
        <div className={styles.tableRowName}>
          <Skeleton width="130px" height="1.4rem" />
          <Skeleton width="120px" height="1.25rem" variant="rectangular" />
        </div>
        <div className={styles.tableRowMeta}>
          <Skeleton width="45px" height="1rem" />
          <Skeleton width="65px" height="1rem" />
          <Skeleton width="50px" height="1rem" />
          <Skeleton width="90px" height="1rem" />
        </div>
      </div>
      <Skeleton width="55px" height="2rem" variant="rectangular" />
    </div>
  );
}

function DataTablesSkeleton(): ReactNode {
  return (
    <div className={styles.tableListSkeleton}>
      {TABLE_ROWS.map((i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Operations
// ─────────────────────────────────────────────────────────────────────────────

function OperationCardSkeleton(): ReactNode {
  return (
    <div className={styles.operationCardSkeleton}>
      <Skeleton width="36px" height="36px" variant="rectangular" />
      <div className={styles.operationContent}>
        <div className={styles.operationHeader}>
          <Skeleton width="110px" height="1.3rem" />
          <Skeleton width="55px" height="1.5rem" variant="rectangular" />
        </div>
        <div className={styles.operationMeta}>
          <Skeleton width="95px" height="1rem" />
          <Skeleton width="85px" height="1rem" />
          <Skeleton width="110px" height="1rem" />
        </div>
      </div>
    </div>
  );
}

function OperationsSkeleton(): ReactNode {
  return (
    <div className={styles.operationsSkeleton}>
      <div className={styles.dateGroupSkeleton}>
        <Skeleton width="110px" height="1rem" />
        <OperationCardSkeleton />
        <OperationCardSkeleton />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Governance
// ─────────────────────────────────────────────────────────────────────────────

function GovernanceSkeleton(): ReactNode {
  return (
    <div className={styles.governanceSkeleton}>
      {/* Approvals */}
      <div className={styles.governanceSection}>
        <Skeleton width="80px" height="1.2rem" />
        <div className={styles.approvalSkeleton}>
          <div className={styles.approvalRow}>
            <Skeleton width="100px" height="1.2rem" />
            <Skeleton width="75px" height="1.625rem" variant="rectangular" />
          </div>
          <Skeleton width="200px" height="1rem" />
        </div>
      </div>

      {/* Compliance */}
      <div className={styles.governanceSection}>
        <Skeleton width="90px" height="1.2rem" />
        <div className={styles.complianceSkeleton}>
          <Skeleton width="200px" height="1.2rem" />
          <Skeleton width="100%" height="0.5rem" variant="rectangular" />
          <Skeleton width="120px" height="1rem" />
        </div>
      </div>

      {/* Stakeholders */}
      <div className={styles.governanceSection}>
        <Skeleton width="95px" height="1.2rem" />
        <div className={styles.stakeholdersSkeleton}>
          {STAKEHOLDER_ROWS.map((i) => (
            <div key={i} className={styles.stakeholderSkeleton}>
              <Skeleton width="36px" height="36px" variant="circular" />
              <div>
                <Skeleton width="100px" height="1.2rem" />
                <Skeleton width="90px" height="1rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: Lineage
// ─────────────────────────────────────────────────────────────────────────────

function LineageSkeleton(): ReactNode {
  return (
    <div className={styles.lineageSkeleton}>
      <div className={styles.lineageColumn}>
        <Skeleton width="160px" height="50px" variant="rectangular" />
        <Skeleton width="160px" height="50px" variant="rectangular" />
      </div>
      <div className={styles.lineageConnectors} />
      <div className={styles.lineageColumn}>
        <Skeleton width="160px" height="50px" variant="rectangular" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SKELETON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dashboard loading skeleton.
 */
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
