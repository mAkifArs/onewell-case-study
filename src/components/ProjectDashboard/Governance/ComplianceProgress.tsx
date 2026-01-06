import type { ReactNode } from "react";
import type { ComplianceChecklist } from "@/types";
import { ProgressBar } from "@/components/ProgressBar";
import styles from "./Governance.module.scss";

interface ComplianceProgressProps {
  checklist: ComplianceChecklist;
}

export function ComplianceProgress({
  checklist,
}: ComplianceProgressProps): ReactNode {
  return (
    <div className={styles.section} data-testid="compliance-progress">
      <h4 className={styles.sectionTitle}>Compliance</h4>
      <div className={styles.complianceCard}>
        <div className={styles.complianceHeader}>
          <span className={styles.templateName}>{checklist.template_name}</span>
          <span className={styles.itemCount}>
            {checklist.completed_items}/{checklist.total_items} items
          </span>
        </div>
        <ProgressBar value={checklist.completion_percentage} data-testid="compliance-bar" />
      </div>
    </div>
  );
}

