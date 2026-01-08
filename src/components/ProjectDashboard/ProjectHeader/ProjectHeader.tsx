import { memo, type ReactNode } from "react";
import { useDashboardProject } from "@/hooks";
import {
  ProjectTypeBadge,
  ProjectStatusBadge,
} from "@/components/ProjectBadge";
import { formatDate } from "@/utils";
import styles from "./ProjectHeader.module.scss";

/**
 * Project header component - uses store directly.
 * Only re-renders when project data changes.
 */
export const ProjectHeader = memo(function ProjectHeader(): ReactNode {
  const project = useDashboardProject();

  if (!project) return null;

  return (
    <header className={styles.header} data-testid="project-header">
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{project.project_name}</h1>
          <div className={styles.badges}>
            <ProjectTypeBadge type={project.project_type} />
            <ProjectStatusBadge status={project.status} />
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
            <span className={styles.metaLabel}>Governance</span>
            <span className={styles.metaValue}>
              {project.governance_manager.name}
            </span>
          </div>
        )}

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Department</span>
          <span className={styles.metaValue}>{project.department.name}</span>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Created</span>
          <span className={styles.metaValue}>
            {formatDate(project.created_at)}
          </span>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Updated</span>
          <span className={styles.metaValue}>
            {formatDate(project.updated_at)}
          </span>
        </div>
      </div>
    </header>
  );
});
