// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE TYPES
// Types related to approvals, compliance, and stakeholders
// ═══════════════════════════════════════════════════════════════════════════════

import type { User } from "./common";

/**
 * Approval status - current state of an approval request
 */
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

/**
 * Approval type - the governance gate being approved
 */
export type ApprovalType =
  | "DevCompletion"
  | "ValidationStart"
  | "ValidationCompletion"
  | "ProductionApproval";

/**
 * Checklist status - current state of a compliance checklist
 */
export type ChecklistStatus = "in_progress" | "Completed";

/**
 * Approval entity - represents an approval request
 */
export interface Approval {
  approval_id: string;
  approval_type: ApprovalType;
  status: ApprovalStatus;
  approver: User;
  requested_by?: User;
  created_at?: string; // ISO 8601
  approved_at?: string; // ISO 8601
  comments: string | null;
}

/**
 * Compliance checklist entity - regulatory compliance tracking
 */
export interface ComplianceChecklist {
  checklist_id: string;
  template_name: string; // e.g., 'SR 11-7 Model Risk Management'
  status: ChecklistStatus;
  completion_percentage: number;
  total_items: number;
  completed_items: number;
  assigned_to: User;
  completed_at?: string; // ISO 8601
}

/**
 * Stakeholder entity - project team member with a specific role
 */
export interface Stakeholder {
  user_id: string;
  name: string;
  role: string; // 'Business Owner', 'Governance Manager', 'Developer'
}

/**
 * Governance entity - complete governance data for a project
 */
export interface Governance {
  approvals: Approval[];
  compliance_checklist: ComplianceChecklist | null;
  stakeholders: Stakeholder[];
}
