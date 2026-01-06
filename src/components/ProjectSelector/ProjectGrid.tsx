import type { ReactNode } from "react";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  onSelect: (projectId: string) => void;
}

export function ProjectGrid({ projects, onSelect }: ProjectGridProps): ReactNode {
  return (
    <>
      {projects.map((project) => (
        <ProjectCard
          key={project.project_id}
          project={project}
          onClick={onSelect}
        />
      ))}
    </>
  );
}

