// ═══════════════════════════════════════════════════════════════════════════════
// DATA TABLE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "./DataTable";
import type { DataTableColumn } from "./types";

// ─────────────────────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────────────────────

interface TestItem {
  id: string;
  name: string;
  value: number;
  category: string;
}

const testData: TestItem[] = [
  { id: "1", name: "Alpha", value: 100, category: "A" },
  { id: "2", name: "Beta", value: 50, category: "B" },
  { id: "3", name: "Gamma", value: 75, category: "A" },
];

const testColumns: DataTableColumn<TestItem>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
    render: (item) => item.name,
  },
  {
    key: "value",
    header: "Value",
    sortable: true,
    sortFn: (a, b) => a.value - b.value,
    render: (item) => item.value.toString(),
  },
  {
    key: "category",
    header: "Category",
    render: (item) => item.category,
  },
];

describe("DataTable", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders table with data", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          testId="test-table"
        />
      );
      expect(screen.getByTestId("test-table")).toBeInTheDocument();
    });

    it("renders all column headers", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
        />
      );
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
    });

    it("renders all data rows", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
        />
      );
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
      expect(screen.getByText("Gamma")).toBeInTheDocument();
    });

    it("renders empty state when no data", () => {
      render(
        <DataTable
          columns={testColumns}
          data={[]}
          getRowKey={(item) => item.id}
          emptyMessage="No items found"
        />
      );
      expect(screen.getByText("No items found")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────────────────────

  describe("search", () => {
    it("renders search input when searchable", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          searchable
          searchPlaceholder="Search..."
          searchFields={(item) => [item.name, item.category]}
        />
      );
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("filters data based on search term", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          searchable
          searchFields={(item) => [item.name]}
        />
      );

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "Alpha" } });

      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Beta")).not.toBeInTheDocument();
      expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
    });

    it("shows empty state with search term when no matches", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          searchable
          searchFields={(item) => [item.name]}
          emptyMessage="No results matching"
        />
      );

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "xyz" } });

      expect(screen.getByText('No results matching "xyz"')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SORTING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("sorting", () => {
    it("renders sort buttons for sortable columns", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          sortable
        />
      );

      // Name and Value are sortable
      const sortButtons = screen.getAllByRole("button");
      expect(sortButtons.length).toBeGreaterThanOrEqual(2);
    });

    it("sorts ascending on first click", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          sortable
        />
      );

      const nameHeader = screen.getByRole("button", { name: /Name/ });
      fireEvent.click(nameHeader);

      const rows = screen.getAllByRole("row");
      // First row is header, so data starts at index 1
      expect(rows[1]).toHaveTextContent("Alpha");
      expect(rows[2]).toHaveTextContent("Beta");
      expect(rows[3]).toHaveTextContent("Gamma");
    });

    it("sorts descending on second click", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          sortable
        />
      );

      const nameHeader = screen.getByRole("button", { name: /Name/ });
      fireEvent.click(nameHeader); // asc
      fireEvent.click(nameHeader); // desc

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Gamma");
      expect(rows[2]).toHaveTextContent("Beta");
      expect(rows[3]).toHaveTextContent("Alpha");
    });

    it("applies default sort on mount", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          sortable
          defaultSort={{ field: "value", direction: "desc" }}
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("100"); // Alpha has highest value
      expect(rows[2]).toHaveTextContent("75"); // Gamma
      expect(rows[3]).toHaveTextContent("50"); // Beta
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW CLICK
  // ─────────────────────────────────────────────────────────────────────────────

  describe("row click", () => {
    it("calls onRowClick when row is clicked", () => {
      const onRowClick = vi.fn();

      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          onRowClick={onRowClick}
        />
      );

      // Click on a cell to trigger row click
      fireEvent.click(screen.getByText("Alpha"));

      expect(onRowClick).toHaveBeenCalledWith(testData[0]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COUNT DISPLAY
  // ─────────────────────────────────────────────────────────────────────────────

  describe("count display", () => {
    it("shows result count when showCount is true", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          showCount
          countLabel="item"
        />
      );

      expect(screen.getByText("3 items")).toBeInTheDocument();
    });

    it("uses singular form for single item", () => {
      render(
        <DataTable
          columns={testColumns}
          data={[testData[0]]}
          getRowKey={(item) => item.id}
          showCount
          countLabel="item"
        />
      );

      expect(screen.getByText("1 item")).toBeInTheDocument();
    });

    it("updates count after search filter", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          searchable
          searchFields={(item) => [item.name]}
          showCount
          countLabel="item"
        />
      );

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "Alpha" } });

      expect(screen.getByText("1 item")).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW HIGHLIGHTING
  // ─────────────────────────────────────────────────────────────────────────────

  describe("row highlighting", () => {
    it("highlights rows when isRowHighlighted returns true", () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          getRowKey={(item) => item.id}
          isRowHighlighted={(item) => item.id === "1"}
        />
      );

      const rows = screen.getAllByRole("row");
      // First data row should be highlighted
      expect(rows[1]).toHaveAttribute("data-highlighted", "true");
      expect(rows[2]).toHaveAttribute("data-highlighted", "false");
    });
  });
});

