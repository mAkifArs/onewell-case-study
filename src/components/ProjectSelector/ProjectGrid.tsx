import type { ReactNode } from "react";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps): ReactNode {
  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </>
  );
}
