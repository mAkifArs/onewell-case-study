import type { ReactNode } from "react";
import type { ProjectType, ProjectStatus } from "@/types";
import { Badge } from "@/components/Badge";

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TYPE BADGE
// ML, TimeSeries, Scorecard, AI
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectTypeBadgeProps {
  type: ProjectType;
  className?: string;
  "data-testid"?: string;
}

export function ProjectTypeBadge({
  type,
  className,
  "data-testid": testId,
}: ProjectTypeBadgeProps): ReactNode {
  const variant = type.toLowerCase() as
    | "ml"
    | "timeseries"
    | "scorecard"
    | "ai";

  return (
    <Badge
      variant={variant}
      className={className}
      data-testid={testId ?? `project-type-badge-${variant}`}
    >
      {type}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT STATUS BADGE
// Draft, Active, Review, Approved, Locked
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
  "data-testid"?: string;
}

export function ProjectStatusBadge({
  status,
  className,
  "data-testid": testId,
}: ProjectStatusBadgeProps): ReactNode {
  const variant = status.toLowerCase() as
    | "draft"
    | "active"
    | "review"
    | "approved"
    | "locked";

  return (
    <Badge
      variant={variant}
      className={className}
      data-testid={testId ?? `project-status-badge-${variant}`}
    >
      {status}
    </Badge>
  );
}
