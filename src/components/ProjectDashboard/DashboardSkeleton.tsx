import type { ReactNode } from "react";
import { Skeleton } from "@/components/Skeleton";
import styles from "./ProjectDashboard.module.scss";

export function DashboardSkeleton(): ReactNode {
  return (
    <>
      <div className={styles.headerSkeleton}>
        <Skeleton width="50%" height="2rem" />
        <Skeleton width="30%" height="1rem" />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.panelSkeleton}>
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="12rem" />
        </div>
        <div className={styles.panelSkeleton}>
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="12rem" />
        </div>
      </div>

      <div className={styles.secondaryGrid}>
        <div className={styles.panelSkeleton}>
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="6rem" />
        </div>
        <div className={styles.panelSkeleton}>
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="6rem" />
        </div>
      </div>
    </>
  );
}

