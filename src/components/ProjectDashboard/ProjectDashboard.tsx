import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useProjectDashboard } from "@/hooks";
import { ErrorState } from "@/components/ErrorState";
import { BackButton } from "@/components/BackButton";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardContent } from "./DashboardContent";
import styles from "./ProjectDashboard.module.scss";

export function ProjectDashboard(): ReactNode {
  const { projectId } = useParams<{ projectId: string }>();
  const { isLoading, error, isReady } = useProjectDashboard(projectId);

  const showSkeleton = isLoading || !isReady;

  return (
    <main className={styles.page} data-testid="project-dashboard">
      <BackButton />
      {error && <ErrorState message={error} />}
      {!error && showSkeleton && <DashboardSkeleton />}
      {!error && !showSkeleton && <DashboardContent />}
    </main>
  );
}
