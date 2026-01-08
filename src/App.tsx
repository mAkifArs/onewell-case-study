import type { ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ProjectSelector } from "@/components/ProjectSelector";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/hooks";

function AppLayout({ children }: { children: ReactNode }): ReactNode {
  // Initialize theme handling
  useTheme();

  return (
    <>
      <Navbar />
      {children}
      <NetworkStatus />
    </>
  );
}

function AppRoutes(): ReactNode {
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Routes>
        <Route path="/" element={<ProjectSelector />} />
        <Route path="/projects/:projectId" element={<ProjectDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export function App(): ReactNode {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}
