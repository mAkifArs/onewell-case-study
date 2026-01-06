import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./ProjectDashboard.module.scss";

export function BackButton(): ReactNode {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <button className={styles.backButton} onClick={handleBack}>
      <ArrowLeft size={16} />
      <span>Back to Projects</span>
    </button>
  );
}

