import type { ReactNode } from "react";
import { useProjects } from "@/hooks";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProjectTable } from "./ProjectTable";
import styles from "./ProjectSelector.module.scss";

export function ProjectSelector(): ReactNode {
  const { projects, isLoading, error } = useProjects();
  return (
    <main className={styles.page} data-testid="project-selector">
      <header className={styles.header}>
        <h1 className={styles.title}>Development Dashboard</h1>
        <p className={styles.subtitle}>Select a project to view details</p>
      </header>

      {error && <ErrorState message={error} />}

      {isLoading ? <LoadingSkeleton /> : <ProjectTable projects={projects} />}
    </main>
  );
}
