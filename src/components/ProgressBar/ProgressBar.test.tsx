// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS BAR COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders with default test id", () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });

    it("renders with custom test id", () => {
      render(<ProgressBar value={50} data-testid="custom-progress" />);
      expect(screen.getByTestId("custom-progress")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<ProgressBar value={50} className="custom-class" />);
      const container = screen.getByTestId("progress-bar");
      expect(container).toHaveClass("custom-class");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // VALUE HANDLING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("value handling", () => {
    it("displays correct percentage value", () => {
      render(<ProgressBar value={65} />);
      expect(screen.getByText("65%")).toBeInTheDocument();
    });

    it("clamps value below 0 to 0", () => {
      render(<ProgressBar value={-10} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("clamps value above 100 to 100", () => {
      render(<ProgressBar value={150} />);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("handles zero value", () => {
      render(<ProgressBar value={0} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("handles 100% value", () => {
      render(<ProgressBar value={100} />);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // LABEL VISIBILITY
  // ─────────────────────────────────────────────────────────────────────────────

  describe("label visibility", () => {
    it("shows label by default", () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("hides label when showLabel is false", () => {
      render(<ProgressBar value={50} showLabel={false} />);
      expect(screen.queryByText("50%")).not.toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY
  // ─────────────────────────────────────────────────────────────────────────────

  describe("accessibility", () => {
    it("has progressbar role", () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("has correct aria-valuenow", () => {
      render(<ProgressBar value={75} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "75"
      );
    });

    it("has correct aria-valuemin", () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemin",
        "0"
      );
    });

    it("has correct aria-valuemax", () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "100"
      );
    });

    it("clamps aria-valuenow for out-of-range values", () => {
      render(<ProgressBar value={-50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "0"
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COLOR MODES
  // ─────────────────────────────────────────────────────────────────────────────

  describe("color modes", () => {
    it("uses default color mode", () => {
      render(<ProgressBar value={50} colorMode="default" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeInTheDocument();
    });

    it("uses gradient color mode", () => {
      render(<ProgressBar value={50} colorMode="gradient" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveStyle({
        backgroundColor: "var(--color-warning)",
      });
    });

    it("shows error color for low values in gradient mode", () => {
      render(<ProgressBar value={20} colorMode="gradient" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveStyle({
        backgroundColor: "var(--color-error)",
      });
    });

    it("shows warning color for mid values in gradient mode", () => {
      render(<ProgressBar value={50} colorMode="gradient" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveStyle({
        backgroundColor: "var(--color-warning)",
      });
    });

    it("shows success color for high values in gradient mode", () => {
      render(<ProgressBar value={80} colorMode="gradient" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveStyle({
        backgroundColor: "var(--color-success)",
      });
    });
  });
});

