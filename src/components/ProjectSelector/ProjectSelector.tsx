import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProjectGrid } from "./ProjectGrid";
import styles from "./ProjectSelector.module.scss";

export function ProjectSelector(): ReactNode {
  const navigate = useNavigate();
  const { projects, isLoading, error } = useProjects();

  const handleSelectProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <main className={styles.page} data-testid="project-selector">
      <header className={styles.header}>
        <h1 className={styles.title}>Model Development Dashboard</h1>
        <p className={styles.subtitle}>Select a project to view details</p>
      </header>

      {error && <ErrorState message={error} />}

      <div className={styles.grid}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <ProjectGrid projects={projects} onSelect={handleSelectProject} />
        )}
      </div>
    </main>
  );
}
