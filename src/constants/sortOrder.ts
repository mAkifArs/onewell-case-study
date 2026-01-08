// ═══════════════════════════════════════════════════════════════════════════════
// SORT ORDER CONSTANTS
// Defines ordering for project status and type values
// ═══════════════════════════════════════════════════════════════════════════════

import type { ProjectStatus, ProjectType } from "@/types";

/**
 * Sort order for project statuses (lifecycle progression)
 */
export const StatusOrder: Record<ProjectStatus, number> = {
  Draft: 0,
  Active: 1,
  Review: 2,
  Approved: 3,
  Locked: 4,
} as const;

/**
 * Sort order for project types
 */
export const TypeOrder: Record<ProjectType, number> = {
  ML: 0,
  TimeSeries: 1,
  Scorecard: 2,
  AI: 3,
} as const;
