import type { ReactNode } from "react";
import { Database, GitBranch } from "lucide-react";
import { clsx } from "clsx";
import styles from "./DataLineage.module.scss";

interface LineageNodeProps {
  name: string;
  type: "source" | "derived";
  isHighlighted: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function LineageNode({
  name,
  type,
  isHighlighted,
  isSelected,
  onClick,
}: LineageNodeProps): ReactNode {
  const Icon = type === "source" ? Database : GitBranch;

  return (
    <button
      className={clsx(
        styles.node,
        isHighlighted && styles.highlighted,
        isSelected && styles.selected
      )}
      onClick={onClick}
      data-testid={`lineage-node-${name}`}
    >
      <span className={styles.nodeIconWrapper}>
        <Icon size={14} className={styles.nodeIcon} />
      </span>
      <span className={styles.nodeName}>{name}</span>
    </button>
  );
}
