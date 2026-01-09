import type { ReactNode } from "react";
import { clsx } from "clsx";
import {
  FileEdit,
  Play,
  Eye,
  CheckCircle,
  Lock,
  Brain,
  TrendingUp,
  ListChecks,
  Sparkles,
} from "lucide-react";
import styles from "./Badge.module.scss";

type BadgeVariant =
  // Project status
  | "draft"
  | "active"
  | "review"
  | "approved"
  | "locked"
  // Project type
  | "ml"
  | "timeseries"
  | "scorecard"
  | "ai"
  // Column roles
  | "exog"
  | "endog"
  | "not_used"
  | "time_id"
  | "lookup"
  // Generic
  | "default"
  | "success"
  | "warning"
  | "error";

// Icons for status and type badges
const BADGE_ICONS: Partial<Record<BadgeVariant, ReactNode>> = {
  // Status icons
  draft: <FileEdit size={12} />,
  active: <Play size={12} />,
  review: <Eye size={12} />,
  approved: <CheckCircle size={12} />,
  locked: <Lock size={12} />,
  // Type icons
  ml: <Brain size={12} />,
  timeseries: <TrendingUp size={12} />,
  scorecard: <ListChecks size={12} />,
  ai: <Sparkles size={12} />,
};

interface BadgeProps {
  /** Badge text */
  children: ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Show icon (auto-enabled for status/type badges) */
  showIcon?: boolean;
  /** Optional className */
  className?: string;
  /** Test ID */
  "data-testid"?: string;
}

/**
 * Badge component for status, type, and role indicators.
 */
export function Badge({
  children,
  variant = "default",
  showIcon = true,
  className,
  "data-testid": testId,
}: BadgeProps): ReactNode {
  const icon = showIcon ? BADGE_ICONS[variant] : null;

  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        icon && styles.withIcon,
        className
      )}
      data-testid={testId}
    >
      {icon}
      {children}
    </span>
  );
}
