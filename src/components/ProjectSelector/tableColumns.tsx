// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT TABLE COLUMNS
// Column configuration for the project list table
// ═══════════════════════════════════════════════════════════════════════════════

import type { Project } from "@/types";
import { StatusOrder, TypeOrder } from "@/constants";
import {
  ProjectTypeBadge,
  ProjectStatusBadge,
} from "@/components/ProjectBadge";
import { type DataTableColumn, dataTableStyles } from "@/components/DataTable";
import { formatDate } from "@/utils";

export const projectColumns: DataTableColumn<Project>[] = [
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
    sortFn: (a, b) => TypeOrder[a.project_type] - TypeOrder[b.project_type],
    render: (p) => <ProjectTypeBadge type={p.project_type} />,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortFn: (a, b) => StatusOrder[a.status] - StatusOrder[b.status],
    render: (p) => <ProjectStatusBadge status={p.status} />,
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
