// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD LAYOUT
// Layout wrapper for project dashboard pages
// Provides back navigation and consistent page structure
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import styles from "./DashboardLayout.module.scss";

/**
 * Dashboard layout for project detail pages
 * - Back button for navigation
 * - Consistent page container styling
 * - Outlet for nested dashboard content
 */
export function DashboardLayout(): ReactNode {
  return (
    <div className={styles.page}>
      <BackButton />
      <Outlet />
    </div>
  );
}
