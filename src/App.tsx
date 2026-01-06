import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectSelector } from "@/components/ProjectSelector";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/hooks";

function AppLayout({ children }: { children: ReactNode }): ReactNode {
  // Initialize theme handling
  useTheme();

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export function App(): ReactNode {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ProjectSelector />} />
          <Route path="/projects/:projectId" element={<ProjectDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
