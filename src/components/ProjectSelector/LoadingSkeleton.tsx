import type { ReactNode } from "react";
import { Skeleton } from "@/components/Skeleton";
import styles from "./ProjectSelector.module.scss";

const SKELETON_COUNT = 4;

export function LoadingSkeleton(): ReactNode {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <Skeleton height="1.5rem" width="70%" />
          <Skeleton height="1rem" width="40%" />
          <Skeleton height="3rem" width="100%" />
          <Skeleton height="1rem" width="50%" />
        </div>
      ))}
    </>
  );
}

