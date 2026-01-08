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

function formatApprovalType(type: string): string {
  return type.replace(/([A-Z])/g, " $1").trim();
}

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
          const statusClass = styles[`status${approval.status}`];

          return (
            <div
              key={approval.approval_id}
              className={styles.approvalCard}
              data-testid={`approval-item-${approval.approval_id}`}
            >
              <div className={styles.approvalCardHeader}>
                <span className={styles.approvalType}>
                  {formatApprovalType(approval.approval_type)}
                </span>
                <span
                  className={`${styles.approvalStatus} ${statusClass}`}
                  data-testid={`approval-status-${approval.status.toLowerCase()}`}
                >
                  <Icon size={14} />
                  {approval.status}
                </span>
              </div>

              <div className={styles.approvalMeta}>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Approver:</span>
                  {approval.approver.name}
                </span>
                {approval.requested_by && (
                  <>
                    <span className={styles.metaSeparator}>·</span>
                    <span className={styles.metaItem}>
                      <span className={styles.metaLabel}>Requested by:</span>
                      {approval.requested_by.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
