import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectSelector } from "@/components/ProjectSelector";

// Placeholder - will be replaced in Phase 4
function ProjectDashboard(): ReactNode {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Project Dashboard</h1>
      <p>Project details will appear here.</p>
    </main>
  );
}

export function App(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectSelector />} />
        <Route path="/projects/:projectId" element={<ProjectDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
