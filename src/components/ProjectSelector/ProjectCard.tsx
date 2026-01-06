import { memo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types";
import { useProjectStore } from "@/store";
import { Badge } from "@/components/Badge";
import styles from "./ProjectSelector.module.scss";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = memo(function ProjectCard({
  project,
}: ProjectCardProps): ReactNode {
  const navigate = useNavigate();
  const selectProject = useProjectStore((state) => state.selectProject);

  const handleSelect = () => {
    selectProject(project.project_id);
    navigate(`/projects/${project.project_id}`);
  };

  const statusVariant = project.status.toLowerCase() as
    | "draft"
    | "active"
    | "review"
    | "approved"
    | "locked";

  return (
    <article
      className={styles.card}
      onClick={handleSelect}
      data-testid={`project-card-${project.project_id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleSelect();
        }
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <h2 className={styles.cardTitle}>{project.project_name}</h2>
          <Badge variant={statusVariant}>{project.status}</Badge>
        </div>
        <span className={styles.projectType}>{project.project_type}</span>
      </div>

      <p className={styles.cardObjectives}>{project.objectives}</p>

      <div className={styles.cardMeta}>
        <span className={styles.department}>
          Department: {project.department.name}
        </span>
      </div>
    </article>
  );
});
