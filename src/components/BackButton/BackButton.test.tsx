// ═══════════════════════════════════════════════════════════════════════════════
// BACK BUTTON COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BackButton } from "./BackButton";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("BackButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders with default label", () => {
      renderWithRouter(<BackButton />);
      expect(screen.getByText("Back to Projects")).toBeInTheDocument();
    });

    it("renders with custom label", () => {
      renderWithRouter(<BackButton label="Go Back" />);
      expect(screen.getByText("Go Back")).toBeInTheDocument();
    });

    it("renders arrow icon", () => {
      renderWithRouter(<BackButton />);
      expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────────

  describe("navigation", () => {
    it("navigates to default path on click", () => {
      renderWithRouter(<BackButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to custom path on click", () => {
      renderWithRouter(<BackButton to="/dashboard" />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});

