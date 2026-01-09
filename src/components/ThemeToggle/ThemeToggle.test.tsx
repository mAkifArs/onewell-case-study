// ═══════════════════════════════════════════════════════════════════════════════
// THEME TOGGLE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

// Mock useTheme hook
const mockSetTheme = vi.fn();
let mockTheme = "light";

vi.mock("@/hooks", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = "light";
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders theme toggle container", () => {
      render(<ThemeToggle />);
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("renders light theme button", () => {
      render(<ThemeToggle />);
      expect(
        screen.getByRole("button", { name: "Switch to light theme" })
      ).toBeInTheDocument();
    });

    it("renders dark theme button", () => {
      render(<ThemeToggle />);
      expect(
        screen.getByRole("button", { name: "Switch to dark theme" })
      ).toBeInTheDocument();
    });

    it("renders sun and moon icons", () => {
      render(<ThemeToggle />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      buttons.forEach((button) => {
        expect(button.querySelector("svg")).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // THEME SWITCHING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("theme switching", () => {
    it("calls setTheme with 'light' when light button clicked", () => {
      render(<ThemeToggle />);
      fireEvent.click(
        screen.getByRole("button", { name: "Switch to light theme" })
      );
      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("calls setTheme with 'dark' when dark button clicked", () => {
      render(<ThemeToggle />);
      fireEvent.click(
        screen.getByRole("button", { name: "Switch to dark theme" })
      );
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIVE STATE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("active state", () => {
    it("marks light button as active when theme is light", () => {
      mockTheme = "light";
      render(<ThemeToggle />);
      const lightButton = screen.getByRole("button", {
        name: "Switch to light theme",
      });
      expect(lightButton).toHaveAttribute("data-active", "true");
    });

    it("marks dark button as active when theme is dark", () => {
      mockTheme = "dark";
      render(<ThemeToggle />);
      const darkButton = screen.getByRole("button", {
        name: "Switch to dark theme",
      });
      expect(darkButton).toHaveAttribute("data-active", "true");
    });
  });
});

