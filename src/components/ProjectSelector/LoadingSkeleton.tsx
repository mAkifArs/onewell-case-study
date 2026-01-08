import type { ReactNode } from "react";
import { Skeleton } from "@/components/Skeleton";
import styles from "./ProjectSelector.module.scss";

const SKELETON_ROWS = 5;

export function LoadingSkeleton(): ReactNode {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.toolbar}>
        <Skeleton height="2.5rem" width="280px" />
        <Skeleton height="1rem" width="80px" />
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.skeletonTable}>
          {/* Header row */}
          <div className={styles.skeletonHeader}>
            <Skeleton height="1rem" width="120px" />
            <Skeleton height="1rem" width="60px" />
            <Skeleton height="1rem" width="60px" />
            <Skeleton height="1rem" width="100px" />
            <Skeleton height="1rem" width="120px" />
            <Skeleton height="1rem" width="80px" />
          </div>

          {/* Data rows */}
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <Skeleton height="1rem" width="180px" />
              <Skeleton height="1.5rem" width="70px" />
              <Skeleton height="1.5rem" width="70px" />
              <Skeleton height="1rem" width="100px" />
              <Skeleton height="1rem" width="140px" />
              <Skeleton height="1rem" width="80px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
