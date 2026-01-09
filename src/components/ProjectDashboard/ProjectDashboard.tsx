// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT DASHBOARD
// Main dashboard view for a single project
// Layout concerns (back button, page container) are handled by DashboardLayout
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useProjectDashboard } from "@/hooks";
import { ErrorState } from "@/components/ErrorState";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardContent } from "./DashboardContent";

export function ProjectDashboard(): ReactNode {
  const { projectId } = useParams<{ projectId: string }>();
  const { isLoading, error, isReady } = useProjectDashboard(projectId);

  const showSkeleton = isLoading || !isReady;

  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Loading state
  if (showSkeleton) {
    return <DashboardSkeleton />;
  }

  // Ready state
  return <DashboardContent />;
}
