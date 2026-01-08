import { memo, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.scss";

interface BackButtonProps {
  to?: string;
  label?: string;
}

/**
 * Reusable back navigation button.
 * Memoized since it rarely changes.
 */
export const BackButton = memo(function BackButton({
  to = "/",
  label = "Back to Projects",
}: BackButtonProps): ReactNode {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(to);
  }, [navigate, to]);

  return (
    <button className={styles.backButton} onClick={handleBack}>
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
});

