import type { ReactNode } from "react";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps): ReactNode {
  return <p className={styles.empty}>{message}</p>;
}
