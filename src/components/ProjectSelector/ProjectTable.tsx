import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types";
import { DataTable } from "@/components/DataTable";
import { createProjectColumns } from "./tableColumns";
import { projectApi } from "@/services";
import { useProjectStore } from "@/store";

interface ProjectTableProps {
  projects: Project[];
}

/**
 * Project list table component.
 */
export function ProjectTable({ projects }: ProjectTableProps): ReactNode {
  const navigate = useNavigate();
  const reloadProjects = useProjectStore((state) => state.reloadProjects);

  const handleDuplicate = async (projectId: string) => {
    try {
      await projectApi.duplicateById(projectId);
      // Reload projects to show the new duplicate
      await reloadProjects();
    } catch (error) {
      console.error("Failed to duplicate project:", error);
      // You could add toast notification here
    }
  };

  return (
    <DataTable
      columns={createProjectColumns(handleDuplicate)}
      data={projects}
      getRowKey={(p) => p.project_id}
      searchable
      searchPlaceholder="Search projects..."
      searchFields={(p) => [
        p.project_name,
        p.project_type,
        p.status,
        p.owner.name,
        p.department.name,
      ]}
      sortable
      defaultSort={{ field: "updated_at", direction: "desc" }}
      onRowClick={(p) => navigate(`/projects/${p.project_id}`)}
      showCount
      countLabel="project"
      emptyMessage="No projects found matching"
      testId="project-table"
    />
  );
}
