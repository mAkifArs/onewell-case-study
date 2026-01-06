import type { ReactNode } from "react";
import type { Project } from "@/types";
import { Badge } from "@/components/Badge";
import { formatDate } from "@/utils";
import styles from "./ProjectHeader.module.scss";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps): ReactNode {
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
    <header className={styles.header} data-testid="project-header">
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{project.project_name}</h1>
          <div className={styles.badges}>
            <Badge variant={typeVariant}>{project.project_type}</Badge>
            <Badge variant={statusVariant}>{project.status}</Badge>
          </div>
        </div>

        <p className={styles.objectives}>{project.objectives}</p>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Owner</span>
          <span className={styles.metaValue}>{project.owner.name}</span>
        </div>

        {project.governance_manager && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Governance Manager</span>
            <span className={styles.metaValue}>{project.governance_manager.name}</span>
          </div>
        )}

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Department</span>
          <Badge variant="default">{project.department.name}</Badge>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Created</span>
          <span className={styles.metaValue}>{formatDate(project.created_at)}</span>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Updated</span>
          <span className={styles.metaValue}>{formatDate(project.updated_at)}</span>
        </div>
      </div>
    </header>
  );
}

