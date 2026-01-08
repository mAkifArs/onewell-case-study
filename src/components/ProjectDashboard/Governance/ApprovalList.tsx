import { memo, useMemo, type ReactNode } from "react";
import clsx from "clsx";
import type { Approval } from "@/types";
import { getApprovalStatusIcon } from "@/constants";
import { formatApprovalType } from "@/utils";
import { LabelValue } from "@/components/LabelValue";
import styles from "./Governance.module.scss";

interface ApprovalListProps {
  approvals: Approval[];
}

/**
 * Approval list component.
 * Memoized to prevent re-renders when parent re-renders.
 */
export const ApprovalList = memo(function ApprovalList({
  approvals,
}: ApprovalListProps): ReactNode {
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
});

// ─────────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

interface ApprovalCardProps {
  approval: Approval;
}

const ApprovalCard = memo(function ApprovalCard({
  approval,
}: ApprovalCardProps): ReactNode {
  const Icon = getApprovalStatusIcon(approval.status);
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
          className={clsx(styles.approvalStatus, statusClass)}
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
                <LabelValue
                  label={item.label}
                  value={item.value}
                  variant="inline"
                />
              </span>
            )
        )}
      </div>
    </div>
  );
});
