import { useMemo, type ReactNode } from "react";
import { useDashboardProject } from "@/hooks";
import {
  ProjectTypeBadge,
  ProjectStatusBadge,
} from "@/components/ProjectBadge";
import { LabelValue } from "@/components/LabelValue";
import { formatDate } from "@/utils";
import styles from "./ProjectHeader.module.scss";

/**
 * Project header component - uses store directly.
 */
export function ProjectHeader(): ReactNode {
  const project = useDashboardProject();

  // Map project data to label-value items
  const metaItems = useMemo(() => {
    if (!project) return [];
    return [
      { label: "Owner", value: project.owner.name },
      { label: "Governance", value: project.governance_manager?.name },
      { label: "Department", value: project.department.name },
      { label: "Created", value: formatDate(project.created_at) },
      { label: "Updated", value: formatDate(project.updated_at) },
    ];
  }, [project]);

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
        {metaItems.map(
          (item) =>
            item.value && (
              <LabelValue
                key={item.label}
                label={item.label}
                value={item.value}
                variant="inline"
              />
            )
        )}
      </div>
    </header>
  );
}
