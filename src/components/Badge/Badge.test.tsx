// ═══════════════════════════════════════════════════════════════════════════════
// BADGE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders children text", () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders with default variant", () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(
        <Badge className="custom-class" data-testid="badge">
          Test
        </Badge>
      );
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("custom-class");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // STATUS VARIANTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("status variants", () => {
    it.each([
      ["draft", "Draft"],
      ["active", "Active"],
      ["review", "Review"],
      ["approved", "Approved"],
      ["locked", "Locked"],
    ])('renders "%s" variant with icon', (variant, label) => {
      render(
        <Badge variant={variant as "draft"} data-testid="badge">
          {label}
        </Badge>
      );
      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
      expect(badge.querySelector("svg")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PROJECT TYPE VARIANTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("project type variants", () => {
    it.each([
      ["ml", "Machine Learning"],
      ["timeseries", "Time Series"],
      ["scorecard", "Scorecard"],
      ["ai", "Artificial Intelligence"],
    ])('renders "%s" type variant with icon', (variant, label) => {
      render(
        <Badge variant={variant as "ml"} data-testid="badge">
          {label}
        </Badge>
      );
      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
      expect(badge.querySelector("svg")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COLUMN ROLE VARIANTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("column role variants", () => {
    it.each(["exog", "endog", "not_used", "time_id", "lookup"])(
      'renders "%s" role variant without icon',
      (variant) => {
        render(
          <Badge variant={variant as "exog"} data-testid="badge">
            {variant}
          </Badge>
        );
        const badge = screen.getByTestId("badge");
        expect(badge).toBeInTheDocument();
        // Role variants don't have icons in BADGE_ICONS
        expect(badge.querySelector("svg")).not.toBeInTheDocument();
      }
    );
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ICON VISIBILITY
  // ─────────────────────────────────────────────────────────────────────────────

  describe("icon visibility", () => {
    it("shows icon by default for variants with icons", () => {
      render(
        <Badge variant="active" data-testid="badge">
          Active
        </Badge>
      );
      expect(screen.getByTestId("badge").querySelector("svg")).toBeInTheDocument();
    });

    it("hides icon when showIcon is false", () => {
      render(
        <Badge variant="active" showIcon={false} data-testid="badge">
          Active
        </Badge>
      );
      expect(screen.getByTestId("badge").querySelector("svg")).not.toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GENERIC VARIANTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("generic variants", () => {
    it.each(["default", "success", "warning", "error"])(
      'renders "%s" generic variant',
      (variant) => {
        render(
          <Badge variant={variant as "default"} data-testid="badge">
            {variant}
          </Badge>
        );
        expect(screen.getByTestId("badge")).toBeInTheDocument();
      }
    );
  });
});

