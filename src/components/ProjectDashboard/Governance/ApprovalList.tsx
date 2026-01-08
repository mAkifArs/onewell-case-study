import { useMemo, type ReactNode } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { Approval } from "@/types";
import { LabelValue } from "@/components/LabelValue";
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
        {approvals.map((approval) => (
          <ApprovalCard key={approval.approval_id} approval={approval} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

interface ApprovalCardProps {
  approval: Approval;
}

function ApprovalCard({ approval }: ApprovalCardProps): ReactNode {
  const Icon = STATUS_ICONS[approval.status];
  const statusClass = styles[`status${approval.status}`];

  // Map approval data to label-value items
  const metaItems = useMemo(
    () => [
      { label: "Approver", value: approval.approver.name },
      { label: "Requested by", value: approval.requested_by?.name },
    ],
    [approval]
  );

  return (
    <div
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
        {metaItems.map(
          (item, index) =>
            item.value && (
              <span key={item.label} className={styles.metaItem}>
                {index > 0 && <span className={styles.metaSeparator}>·</span>}
                <LabelValue label={item.label} value={item.value} variant="inline" />
              </span>
            )
        )}
      </div>
    </div>
  );
}
