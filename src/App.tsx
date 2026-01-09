// ═══════════════════════════════════════════════════════════════════════════════
// APP - ROOT COMPONENT
// Application entry point with routing configuration
// Uses layout components with React Router Outlet pattern
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout, DashboardLayout } from "@/layouts";
import { ProjectSelector } from "@/components/ProjectSelector";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Root application component
 * - BrowserRouter for client-side routing
 * - Nested layouts using Outlet pattern
 * - ErrorBoundary wraps each page for isolation
 */
export function App(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main App Layout - pages with navbar */}
        <Route element={<AppLayout />}>
          {/* Project Selector - home page */}
          <Route
            path="/"
            element={
              <ErrorBoundary resetKey="home">
                <ProjectSelector />
              </ErrorBoundary>
            }
          />

          {/* Dashboard Layout - project detail pages */}
          <Route element={<DashboardLayout />}>
            <Route
              path="/projects/:projectId"
              element={
                <ErrorBoundary resetKey="dashboard">
                  <ProjectDashboard />
                </ErrorBoundary>
              }
            />
          </Route>
        </Route>

        {/* Fallback - redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
