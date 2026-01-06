import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Placeholder components - will be replaced
function ProjectSelector(): ReactNode {
  return (
    <main>
      <h1>Project Selector</h1>
      <p>Select a project to view its dashboard.</p>
    </main>
  );
}

function ProjectDashboard(): ReactNode {
  return (
    <main>
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
