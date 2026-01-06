// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT TYPES
// Types related to projects and their metadata
// ═══════════════════════════════════════════════════════════════════════════════

import type { User, Department } from "./common";

/**
 * Project lifecycle status
 * Draft → Active → Review → Approved → Locked
 */
export type ProjectStatus =
  | "Draft"
  | "Active"
  | "Review"
  | "Approved"
  | "Locked";

/**
 * Project model type - determines the modeling approach
 */
export type ProjectType = "ML" | "TimeSeries" | "Scorecard" | "AI";

/**
 * Project entity - main workspace for model development
 */
export interface Project {
  project_id: string;
  project_name: string;
  project_type: ProjectType;
  status: ProjectStatus;
  owner: User;
  governance_manager: User | null;
  department: Department;
  is_segmented: boolean;
  objectives: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
