import type { ReactNode } from "react";
import type { Project } from "@/types";
import { Badge } from "@/components/Badge";
import { formatDate } from "@/utils";
import styles from "./ProjectSelector.module.scss";

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps): ReactNode {
  const statusVariant = project.status.toLowerCase() as
    | "draft"
    | "active"
    | "review"
    | "approved"
    | "locked";

  const typeVariant = project.project_type.toLowerCase() as
    | "ml"
    | "timeseries"
    | "scorecard"
    | "ai";

  return (
    <article
      className={styles.card}
      onClick={() => onClick(project.project_id)}
      data-testid={`project-card-${project.project_id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(project.project_id);
        }
      }}
    >
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{project.project_name}</h2>
        <div className={styles.badges}>
          <Badge variant={typeVariant}>{project.project_type}</Badge>
          <Badge variant={statusVariant}>{project.status}</Badge>
        </div>
      </div>

      <p className={styles.cardObjectives}>{project.objectives}</p>

      <div className={styles.cardMeta}>
        <span className={styles.owner}>{project.owner.name}</span>
        <span className={styles.date}>Updated {formatDate(project.updated_at)}</span>
      </div>
    </article>
  );
}

