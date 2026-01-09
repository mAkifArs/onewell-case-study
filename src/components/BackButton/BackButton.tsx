import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.scss";

interface BackButtonProps {
  to?: string;
  label?: string;
}

/**
 * Reusable back navigation button.
 */
export function BackButton({
  to = "/",
  label = "Back to Projects",
}: BackButtonProps): ReactNode {
  const navigate = useNavigate();

  return (
    <button className={styles.backButton} onClick={() => navigate(to)}>
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
}

