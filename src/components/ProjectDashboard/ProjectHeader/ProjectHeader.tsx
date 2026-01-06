import { memo, type ReactNode } from "react";
import type { Project } from "@/types";
import { Badge } from "@/components/Badge";
import { formatDate } from "@/utils";
import styles from "./ProjectHeader.module.scss";

interface ProjectHeaderProps {
  project: Project;
}

interface MetaItem {
  label: string;
  value: string;
}

export const ProjectHeader = memo(function ProjectHeader({
  project,
}: ProjectHeaderProps): ReactNode {
  const statusVariant = project.status.toLowerCase() as
    | "draft"
    | "active"
    | "review"
    | "approved"
    | "locked";

  const metaItems: MetaItem[] = [
    { label: "Owner", value: project.owner.name },
    ...(project.governance_manager
      ? [
          {
            label: "Governance Manager",
            value: project.governance_manager.name,
          },
        ]
      : []),
    { label: "Department", value: project.department.name },
    { label: "Created", value: formatDate(project.created_at) },
    { label: "Updated", value: formatDate(project.updated_at) },
  ];

  return (
    <header className={styles.header} data-testid="project-header">
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{project.project_name}</h1>
          <Badge variant={statusVariant}>{project.status}</Badge>
        </div>
        <span className={styles.projectType}>
          Project Type: {project.project_type}
        </span>

        <p className={styles.objectives}>{project.objectives}</p>
      </div>

      <div className={styles.meta}>
        {metaItems.map((item) => (
          <div key={item.label} className={styles.metaItem}>
            <span className={styles.metaLabel}>{item.label}</span>
            <span className={styles.metaValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </header>
  );
});
