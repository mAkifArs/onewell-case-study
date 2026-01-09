import type { ReactNode } from "react";
import { useDashboardGovernance } from "@/hooks";
import { EmptyState } from "@/components/EmptyState";
import { ApprovalList } from "./ApprovalList";
import { ComplianceProgress } from "./ComplianceProgress";
import { StakeholderList } from "./StakeholderList";
import styles from "./Governance.module.scss";

/**
 * Governance component - uses store directly.
 */
export function Governance(): ReactNode {
  const governance = useDashboardGovernance();

  if (!governance) {
    return <EmptyState message="No governance data available" />;
  }

  return (
    <div className={styles.container}>
      <ApprovalList approvals={governance.approvals} />

      {governance.compliance_checklist && (
        <ComplianceProgress checklist={governance.compliance_checklist} />
      )}

      <StakeholderList stakeholders={governance.stakeholders} />
    </div>
  );
}
