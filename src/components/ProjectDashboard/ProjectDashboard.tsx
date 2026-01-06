import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useProjectDashboard } from "@/hooks";
import { ErrorState } from "@/components/ErrorState";
import { BackButton } from "./BackButton";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardContent } from "./DashboardContent";
import styles from "./ProjectDashboard.module.scss";

export function ProjectDashboard(): ReactNode {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading, error } = useProjectDashboard(projectId);

  if (error) {
    return (
      <main className={styles.page}>
        <ErrorState message={error} />
      </main>
    );
  }

  return (
    <main className={styles.page} data-testid="project-dashboard">
      <BackButton />

      {isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <DashboardContent
          project={data.project}
          tables={data.tables}
          operations={data.operations}
          governance={data.governance}
          lineage={data.lineage}
        />
      )}
    </main>
  );
}
