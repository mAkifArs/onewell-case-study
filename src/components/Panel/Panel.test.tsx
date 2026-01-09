// ═══════════════════════════════════════════════════════════════════════════════
// PANEL COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Panel } from "./Panel";

describe("Panel", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders title", () => {
      render(<Panel title="Test Panel">Content</Panel>);
      expect(screen.getByText("Test Panel")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(<Panel title="Panel">Child content here</Panel>);
      expect(screen.getByText("Child content here")).toBeInTheDocument();
    });

    it("renders with test id", () => {
      render(
        <Panel title="Panel" data-testid="test-panel">
          Content
        </Panel>
      );
      expect(screen.getByTestId("test-panel")).toBeInTheDocument();
    });

    it("renders as section element", () => {
      render(
        <Panel title="Panel" data-testid="test-panel">
          Content
        </Panel>
      );
      const panel = screen.getByTestId("test-panel");
      expect(panel.tagName).toBe("SECTION");
    });

    it("applies custom className", () => {
      render(
        <Panel title="Panel" className="custom-class" data-testid="panel">
          Content
        </Panel>
      );
      expect(screen.getByTestId("panel")).toHaveClass("custom-class");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // INFO TOOLTIP
  // ─────────────────────────────────────────────────────────────────────────────

  describe("info tooltip", () => {
    it("renders info button when info prop is provided", () => {
      render(
        <Panel title="Panel" info="Some helpful info">
          Content
        </Panel>
      );
      expect(
        screen.getByRole("button", { name: "Panel info" })
      ).toBeInTheDocument();
    });

    it("does not render info button when info prop is not provided", () => {
      render(<Panel title="Panel">Content</Panel>);
      expect(
        screen.queryByRole("button", { name: "Panel info" })
      ).not.toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // HEADING LEVEL
  // ─────────────────────────────────────────────────────────────────────────────

  describe("heading", () => {
    it("renders title as h2 heading", () => {
      render(<Panel title="Panel Title">Content</Panel>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Panel Title");
    });
  });
});

