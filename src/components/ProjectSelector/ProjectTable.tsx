import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Project, ProjectStatus, ProjectType } from "@/types";
import { Badge } from "@/components/Badge";
import {
  DataTable,
  type DataTableColumn,
  dataTableStyles,
} from "@/components/DataTable";
import { formatDate } from "@/utils";

interface ProjectTableProps {
  projects: Project[];
}

// Sort order mappings
const STATUS_ORDER: Record<ProjectStatus, number> = {
  Draft: 0,
  Active: 1,
  Review: 2,
  Approved: 3,
  Locked: 4,
};

const TYPE_ORDER: Record<ProjectType, number> = {
  ML: 0,
  TimeSeries: 1,
  Scorecard: 2,
  AI: 3,
};

// Column configuration
const columns: DataTableColumn<Project>[] = [
  {
    key: "project_name",
    header: "Project Name",
    sortable: true,
    sortFn: (a, b) => a.project_name.localeCompare(b.project_name),
    render: (p) => (
      <span className={dataTableStyles.cellPrimary}>{p.project_name}</span>
    ),
  },
  {
    key: "project_type",
    header: "Type",
    sortable: true,
    sortFn: (a, b) => TYPE_ORDER[a.project_type] - TYPE_ORDER[b.project_type],
    render: (p) => (
      <Badge
        variant={
          p.project_type.toLowerCase() as
            | "ml"
            | "timeseries"
            | "scorecard"
            | "ai"
        }
      >
        {p.project_type}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortFn: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
    render: (p) => (
      <Badge
        variant={
          p.status.toLowerCase() as
            | "draft"
            | "active"
            | "review"
            | "approved"
            | "locked"
        }
      >
        {p.status}
      </Badge>
    ),
  },
  {
    key: "owner",
    header: "Owner",
    sortable: true,
    sortFn: (a, b) => a.owner.name.localeCompare(b.owner.name),
    hideOnMobile: true,
    render: (p) => p.owner.name,
  },
  {
    key: "department",
    header: "Department",
    sortable: true,
    sortFn: (a, b) => a.department.name.localeCompare(b.department.name),
    hideOnTablet: true,
    render: (p) => p.department.name,
  },
  {
    key: "updated_at",
    header: "Updated",
    sortable: true,
    sortFn: (a, b) =>
      new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
    hideOnMobile: true,
    render: (p) => (
      <span className={dataTableStyles.cellDate}>
        {formatDate(p.updated_at)}
      </span>
    ),
  },
];

export function ProjectTable({ projects }: ProjectTableProps): ReactNode {
  const navigate = useNavigate();

  return (
    <DataTable
      columns={columns}
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
