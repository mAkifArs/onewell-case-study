import type { ReactNode } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { Approval } from "@/types";
import styles from "./Governance.module.scss";

interface ApprovalListProps {
  approvals: Approval[];
}

const STATUS_ICONS = {
  Pending: Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
} as const;

export function ApprovalList({ approvals }: ApprovalListProps): ReactNode {
  if (approvals.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Approvals</h4>
      <div className={styles.approvalList}>
        {approvals.map((approval) => {
          const Icon = STATUS_ICONS[approval.status];
          return (
            <div
              key={approval.approval_id}
              className={styles.approvalItem}
              data-status={approval.status.toLowerCase()}
              data-testid={`approval-item-${approval.approval_id}`}
            >
              <Icon size={16} className={styles.statusIcon} />
              <div className={styles.approvalInfo}>
                <span className={styles.approvalType}>
                  {approval.approval_type.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className={styles.approver}>{approval.approver.name}</span>
              </div>
              <span
                className={styles.statusBadge}
                data-testid={`approval-status-${approval.status.toLowerCase()}`}
              >
                {approval.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

