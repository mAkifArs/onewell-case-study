import { memo, type ReactNode } from "react";
import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { DataTableProps, SortState, DataTableColumn } from "./types";
import styles from "./DataTable.module.scss";

/**
 * Generic data table component with search, sort, and row click support.
 * Memoized to prevent unnecessary re-renders.
 */
function DataTableComponent<T>({
  columns,
  data,
  getRowKey,
  // Search
  searchable = false,
  searchPlaceholder = "Search...",
  searchFields,
  // Sorting
  sortable = false,
  defaultSort,
  // Row interactions
  onRowClick,
  isRowHighlighted,
  // Display
  showCount = false,
  countLabel = "item",
  emptyMessage = "No results found",
  testId,
}: DataTableProps<T>): ReactNode {
  const [search, setSearch] = useState("");
  const [sortState, setSortState] = useState<SortState | null>(
    defaultSort ?? null
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTERING
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!searchable || !search.trim() || !searchFields) {
      return data;
    }

    const term = search.toLowerCase();
    return data.filter((row) =>
      searchFields(row).some((field) => field.toLowerCase().includes(term))
    );
  }, [data, search, searchable, searchFields]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SORTING
  // ─────────────────────────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!sortable || !sortState) {
      return filteredData;
    }

    const column = columns.find((c) => c.key === sortState.field);
    if (!column?.sortFn) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const comparison = column.sortFn!(a, b);
      return sortState.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortable, sortState, columns]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSort = (field: string) => {
    if (!sortable) return;

    const column = columns.find((c) => c.key === field);
    if (!column?.sortable) return;

    setSortState((prev) => {
      if (prev?.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  const getSortIcon = (field: string) => {
    if (!sortState || sortState.field !== field) {
      return <ArrowUpDown size={14} />;
    }
    return sortState.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  const renderHeader = (column: DataTableColumn<T>) => {
    if (sortable && column.sortable) {
      return (
        <button
          className={styles.sortButton}
          onClick={() => handleSort(column.key)}
          type="button"
        >
          {column.header} {getSortIcon(column.key)}
        </button>
      );
    }
    return column.header;
  };

  const getColumnClasses = (column: DataTableColumn<T>) => {
    const classes: string[] = [];
    if (column.hideOnMobile) classes.push(styles.hideOnMobile);
    if (column.hideOnTablet) classes.push(styles.hideOnTablet);
    return classes.join(" ");
  };

  const hasToolbar = searchable || showCount;
  const isClickable = !!onRowClick;

  return (
    <div className={styles.container} data-testid={testId}>
      {hasToolbar && (
        <div className={styles.toolbar}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}
          {showCount && (
            <span className={styles.resultCount}>
              {filteredData.length} {countLabel}
              {filteredData.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table} data-clickable={isClickable}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={getColumnClasses(col)}>
                  {renderHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => {
              const highlighted = isRowHighlighted?.(row) ?? false;
              return (
                <tr
                  key={getRowKey(row)}
                  data-highlighted={highlighted}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={getColumnClasses(col)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className={styles.emptyState}>
            {search ? `${emptyMessage} "${search}"` : emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}

// Export memoized version with generic type preserved
export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;
