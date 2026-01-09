import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { scan } from "react-scan";
import { App } from "./App";
import "./styles/global.scss";

// Enable react-scan in development to detect unnecessary re-renders
if (import.meta.env.DEV) {
  scan({
    enabled: true,
    log: true, // Log renders to console
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
