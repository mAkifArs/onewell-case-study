import type { ReactNode } from "react";

/**
 * Column definition for DataTable
 */
export interface DataTableColumn<T> {
  /** Unique identifier for the column */
  key: string;
  /** Display header text */
  header: string;
  /** Render function for cell content */
  render: (row: T) => ReactNode;
  /** Whether this column is sortable (only used when table is sortable) */
  sortable?: boolean;
  /** Custom sort function (default: string comparison) */
  sortFn?: (a: T, b: T) => number;
  /** Hide this column on mobile screens */
  hideOnMobile?: boolean;
  /** Hide this column on tablet screens */
  hideOnTablet?: boolean;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  field: string;
  direction: SortDirection;
}

/**
 * Props for the DataTable component
 */
export interface DataTableProps<T> {
  /** Column configuration */
  columns: DataTableColumn<T>[];
  /** Data to display */
  data: T[];
  /** Function to get unique key for each row */
  getRowKey: (row: T) => string;

  // ─────────────────────────────────────────────────────────────────────────────
  // SEARCH (opt-in)
  // ─────────────────────────────────────────────────────────────────────────────
  /** Enable search functionality */
  searchable?: boolean;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Function to get searchable fields from a row */
  searchFields?: (row: T) => string[];

  // ─────────────────────────────────────────────────────────────────────────────
  // SORTING (opt-in)
  // ─────────────────────────────────────────────────────────────────────────────
  /** Enable sorting functionality */
  sortable?: boolean;
  /** Default sort state */
  defaultSort?: SortState;

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW INTERACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Function to determine if a row should be highlighted */
  isRowHighlighted?: (row: T) => boolean;

  // ─────────────────────────────────────────────────────────────────────────────
  // DISPLAY OPTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  /** Show result count in toolbar */
  showCount?: boolean;
  /** Label for count (e.g., "project", "item") - pluralized automatically */
  countLabel?: string;
  /** Message to show when no results */
  emptyMessage?: string;
  /** Test ID for the table wrapper */
  testId?: string;
}

