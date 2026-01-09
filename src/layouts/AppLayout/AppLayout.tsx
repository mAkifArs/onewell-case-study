// ═══════════════════════════════════════════════════════════════════════════════
// APP LAYOUT
// Main application layout with navbar, content area, and global components
// Used for authenticated/main application pages
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { NetworkStatus } from "@/components/NetworkStatus";
import { useTheme } from "@/hooks";
import styles from "./AppLayout.module.scss";

/**
 * Main application layout
 * - Navbar at top
 * - Main content area with Outlet for nested routes
 * - NetworkStatus indicator (fixed position)
 */
export function AppLayout(): ReactNode {
  // Initialize theme handling (applies theme class to document)
  useTheme();

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <NetworkStatus />
    </div>
  );
}
