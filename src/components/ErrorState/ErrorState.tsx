import type { ReactNode } from "react";
import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): ReactNode {
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div className={styles.error} role="alert">
      <p>{message}</p>
      <button onClick={handleRetry}>Retry</button>
    </div>
  );
}

