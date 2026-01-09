// ═══════════════════════════════════════════════════════════════════════════════
// ERROR STATE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders error message", () => {
      render(<ErrorState message="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("renders retry button", () => {
      render(<ErrorState message="Error" />);
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });

    it("has alert role for accessibility", () => {
      render(<ErrorState message="Error" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RETRY FUNCTIONALITY
  // ─────────────────────────────────────────────────────────────────────────────

  describe("retry functionality", () => {
    it("calls custom onRetry when provided", () => {
      const onRetry = vi.fn();
      render(<ErrorState message="Error" onRetry={onRetry} />);

      fireEvent.click(screen.getByRole("button", { name: "Retry" }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("reloads page when no onRetry provided", () => {
      const reloadMock = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: reloadMock },
        writable: true,
      });

      render(<ErrorState message="Error" />);
      fireEvent.click(screen.getByRole("button", { name: "Retry" }));

      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });
});

