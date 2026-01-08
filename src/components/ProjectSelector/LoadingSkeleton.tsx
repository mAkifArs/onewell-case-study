import { memo, type ReactNode } from "react";
import { Skeleton } from "@/components/Skeleton";
import styles from "./ProjectSelector.module.scss";

// Pre-computed array to avoid recreation on each render
const SKELETON_ROWS = [0, 1, 2, 3, 4];

// Memoized since this is a pure static component with no props
export const LoadingSkeleton = memo(function LoadingSkeleton(): ReactNode {
  return (
    <div className={styles.skeletonContainer}>
      {/* Toolbar: Search + Count */}
      <div className={styles.skeletonToolbar}>
        <Skeleton height="2.5rem" className={styles.skeletonSearch} />
        <Skeleton height="1rem" width="80px" />
      </div>

      {/* Table */}
      <div className={styles.skeletonTableWrapper}>
        {/* Header row */}
        <div className={styles.skeletonHeader}>
          <div className={styles.skeletonCell}>
            <Skeleton height="0.75rem" width="80px" />
          </div>
          <div className={styles.skeletonCell}>
            <Skeleton height="0.75rem" width="40px" />
          </div>
          <div className={styles.skeletonCell}>
            <Skeleton height="0.75rem" width="50px" />
          </div>
          <div className={`${styles.skeletonCell} ${styles.hideOnMobile}`}>
            <Skeleton height="0.75rem" width="50px" />
          </div>
          <div className={`${styles.skeletonCell} ${styles.hideOnTablet}`}>
            <Skeleton height="0.75rem" width="80px" />
          </div>
          <div className={`${styles.skeletonCell} ${styles.hideOnMobile}`}>
            <Skeleton height="0.75rem" width="60px" />
          </div>
        </div>

        {/* Data rows */}
        {SKELETON_ROWS.map((i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={styles.skeletonCell}>
              <Skeleton height="1rem" width="160px" />
            </div>
            <div className={styles.skeletonCell}>
              <Skeleton height="1.5rem" width="70px" variant="rectangular" />
            </div>
            <div className={styles.skeletonCell}>
              <Skeleton height="1.5rem" width="70px" variant="rectangular" />
            </div>
            <div className={`${styles.skeletonCell} ${styles.hideOnMobile}`}>
              <Skeleton height="1rem" width="100px" />
            </div>
            <div className={`${styles.skeletonCell} ${styles.hideOnTablet}`}>
              <Skeleton height="1rem" width="130px" />
            </div>
            <div className={`${styles.skeletonCell} ${styles.hideOnMobile}`}>
              <Skeleton height="1rem" width="80px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
