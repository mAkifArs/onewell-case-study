import { memo, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types";
import { DataTable } from "@/components/DataTable";
import { projectColumns } from "./tableColumns";

interface ProjectTableProps {
  projects: Project[];
}

/**
 * Project list table component.
 * Memoized to prevent re-renders when parent re-renders but projects unchanged.
 */
export const ProjectTable = memo(function ProjectTable({
  projects,
}: ProjectTableProps): ReactNode {
  const navigate = useNavigate();

  // Stable callback reference - won't cause DataTable to re-render
  const handleRowClick = useCallback(
    (p: Project) => navigate(`/projects/${p.project_id}`),
    [navigate]
  );

  return (
    <DataTable
      columns={projectColumns}
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
      onRowClick={handleRowClick}
      showCount
      countLabel="project"
      emptyMessage="No projects found matching"
      testId="project-table"
    />
  );
});
