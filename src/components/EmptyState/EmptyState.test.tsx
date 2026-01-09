// ═══════════════════════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders message text", () => {
    render(<EmptyState message="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders as paragraph element", () => {
    render(<EmptyState message="Empty" />);
    const element = screen.getByText("Empty");
    expect(element.tagName).toBe("P");
  });
});

