import type { ReactNode } from "react";
import { Skeleton } from "@/components/Skeleton";
import styles from "./ProjectDashboard.module.scss";

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON: ProjectHeader
// ─────────────────────────────────────────────────────────────────────────────

function HeaderSkeleton(): ReactNode {
  return (
    <div className={styles.headerSkeleton}>
      {/* Top section: Title + badges, Objectives */}
      <div className={styles.headerTop}>
        <div className={styles.headerTitleRow}>
          {/* Title: 1.5rem font × ~1.3 line-height = ~2rem */}
          <Skeleton width="320px" height="2rem" />
          <div className={styles.headerBadges}>
            {/* Badges: 0.75rem font + 8px padding + line-height ≈ 1.75rem */}
            <Skeleton width="70px" height="1.75rem" variant="rectangular" />
            <Skeleton width="80px" height="1.75rem" variant="rectangular" />
          </div>
        </div>
        {/* Objectives: 0.9375rem × 1.5 line-height ≈ 1.4rem */}
        <Skeleton width="100%" height="1.4rem" />
      </div>

      {/* Meta section - inline style matching actual component */}
      <div className={styles.headerMeta}>
        {/* Label: 0.625rem × ~1.4 ≈ 0.875rem, Value: 0.8125rem × ~1.4 ≈ 1.15rem */}
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
        {/* Panel title: ~1rem font × ~1.4 line-height ≈ 1.4rem */}
        <Skeleton width="130px" height="1.4rem" />
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
          {/* Display name: ~1rem font × 1.4 ≈ 1.4rem */}
          <Skeleton width="130px" height="1.4rem" />
          {/* Code badge: smaller monospace */}
          <Skeleton width="120px" height="1.25rem" variant="rectangular" />
        </div>
        <div className={styles.tableRowMeta}>
          {/* Small meta text: ~0.75rem × 1.4 ≈ 1rem */}
          <Skeleton width="45px" height="1rem" />
          <Skeleton width="65px" height="1rem" />
          <Skeleton width="50px" height="1rem" />
          <Skeleton width="90px" height="1rem" />
        </div>
      </div>
      {/* Version button */}
      <Skeleton width="55px" height="2rem" variant="rectangular" />
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
      {/* Icon */}
      <Skeleton width="36px" height="36px" variant="rectangular" />
      {/* Content */}
      <div className={styles.operationContent}>
        <div className={styles.operationHeader}>
          {/* Operation name: ~0.9375rem × 1.4 ≈ 1.3rem */}
          <Skeleton width="110px" height="1.3rem" />
          {/* Time badge */}
          <Skeleton width="55px" height="1.5rem" variant="rectangular" />
        </div>
        <div className={styles.operationMeta}>
          {/* Meta items: ~0.75rem × 1.4 ≈ 1rem */}
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
      {/* Date group */}
      <div className={styles.dateGroupSkeleton}>
        {/* Date label: ~0.75rem × 1.4 ≈ 1rem */}
        <Skeleton width="110px" height="1rem" />
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
        {/* Section title: h4 ~0.875rem × 1.4 ≈ 1.2rem */}
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
          {Array.from({ length: 3 }).map((_, i) => (
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
