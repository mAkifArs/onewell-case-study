import { Clock, CheckCircle, XCircle, type LucideIcon } from "lucide-react";
import type { ApprovalStatus } from "@/types";

export interface ApprovalStatusStyle {
  icon: LucideIcon;
}

/**
 * Map approval status to icon configuration.
 * Used in ApprovalCard for consistent styling.
 */
export const ApprovalStatusConfig: Record<ApprovalStatus, ApprovalStatusStyle> = {
  Pending: { icon: Clock },
  Approved: { icon: CheckCircle },
  Rejected: { icon: XCircle },
} as const;

/**
 * Get approval status icon by status.
 */
export function getApprovalStatusIcon(status: ApprovalStatus): LucideIcon {
  return ApprovalStatusConfig[status].icon;
}

