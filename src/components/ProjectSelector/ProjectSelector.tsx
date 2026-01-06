import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "@/services";
import type { Project } from "@/types";
import { Skeleton } from "@/components/Skeleton";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectSelector.module.scss";

export function ProjectSelector(): ReactNode {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const handleSelectProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <main className={styles.page} data-testid="project-selector">
      <header className={styles.header}>
        <h1 className={styles.title}>Model Development Dashboard</h1>
        <p className={styles.subtitle}>Select a project to view details</p>
      </header>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <Skeleton height="1.5rem" width="70%" />
                <Skeleton height="1rem" width="40%" />
                <Skeleton height="3rem" width="100%" />
                <Skeleton height="1rem" width="50%" />
              </div>
            ))
          : projects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={project}
                onClick={handleSelectProject}
              />
            ))}
      </div>
    </main>
  );
}

