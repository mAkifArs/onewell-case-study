// ═══════════════════════════════════════════════════════════════════════════════
// LABEL VALUE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LabelValue } from "./LabelValue";

describe("LabelValue", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders label and value", () => {
      render(<LabelValue label="Name" value="John Doe" />);
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders nothing when value is null", () => {
      const { container } = render(<LabelValue label="Name" value={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when value is undefined", () => {
      const { container } = render(<LabelValue label="Name" value={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders ReactNode as value", () => {
      render(
        <LabelValue label="Status" value={<span data-testid="badge">Active</span>} />
      );
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(
        <LabelValue label="Name" value="John" className="custom-class" />
      );
      const container = screen.getByText("Name").parentElement;
      expect(container).toHaveClass("custom-class");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // VARIANTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("variants", () => {
    it("uses default variant by default", () => {
      render(<LabelValue label="Name" value="John" />);
      const container = screen.getByText("Name").parentElement;
      // CSS modules hash the class names, so we check for partial match
      expect(container?.className).toMatch(/default/);
    });

    it("applies inline variant", () => {
      render(<LabelValue label="Name" value="John" variant="inline" />);
      const container = screen.getByText("Name").parentElement;
      expect(container?.className).toMatch(/inline/);
    });

    it("applies stacked variant", () => {
      render(<LabelValue label="Name" value="John" variant="stacked" />);
      const container = screen.getByText("Name").parentElement;
      expect(container?.className).toMatch(/stacked/);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // EDGE CASES
  // ─────────────────────────────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("renders empty string value", () => {
      render(<LabelValue label="Name" value="" />);
      // Empty string is falsy but not null/undefined
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("renders 0 as value", () => {
      render(<LabelValue label="Count" value={0} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("renders false as value", () => {
      render(<LabelValue label="Active" value="false" />);
      expect(screen.getByText("false")).toBeInTheDocument();
    });
  });
});

