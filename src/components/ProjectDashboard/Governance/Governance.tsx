import type { ReactNode } from "react";
import type { Governance as GovernanceType } from "@/types";
import { EmptyState } from "@/components/EmptyState";
import { ApprovalList } from "./ApprovalList";
import { ComplianceProgress } from "./ComplianceProgress";
import { StakeholderList } from "./StakeholderList";
import styles from "./Governance.module.scss";

interface GovernanceProps {
  governance: GovernanceType | null;
}

export function Governance({ governance }: GovernanceProps): ReactNode {
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
