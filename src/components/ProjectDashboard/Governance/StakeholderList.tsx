import type { ReactNode } from "react";
import { User } from "lucide-react";
import type { Stakeholder } from "@/types";
import styles from "./Governance.module.scss";

interface StakeholderListProps {
  stakeholders: Stakeholder[];
}

export function StakeholderList({
  stakeholders,
}: StakeholderListProps): ReactNode {
  if (stakeholders.length === 0) {
    return null;
  }

  return (
    <div className={styles.section} data-testid="stakeholder-list">
      <h4 className={styles.sectionTitle}>Stakeholders</h4>
      <div className={styles.stakeholderList}>
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.user_id}
            className={styles.stakeholderItem}
            data-testid={`stakeholder-item-${stakeholder.user_id}`}
          >
            <div className={styles.stakeholderAvatar}>
              <User size={14} />
            </div>
            <div className={styles.stakeholderInfo}>
              <span className={styles.stakeholderName}>{stakeholder.name}</span>
              <span className={styles.stakeholderRole}>{stakeholder.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
