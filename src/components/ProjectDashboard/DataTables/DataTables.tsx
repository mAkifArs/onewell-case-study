import type { ReactNode } from "react";
import type { ProjectTable } from "@/types";
import { useExpandedState } from "@/hooks";
import { EmptyState } from "@/components/EmptyState";
import { TableList } from "./TableList";

interface DataTablesProps {
  tables: ProjectTable[];
}

export function DataTables({ tables }: DataTablesProps): ReactNode {
  const {
    expandedIds: expandedTables,
    toggle: toggleTable,
  } = useExpandedState();

  const {
    expandedIds: expandedVersions,
    toggle: toggleVersions,
  } = useExpandedState();

  if (tables.length === 0) {
    return <EmptyState message="No tables in this project" />;
  }

  return (
    <TableList
      tables={tables}
      expandedTables={expandedTables}
      expandedVersions={expandedVersions}
      onToggleTable={toggleTable}
      onToggleVersions={toggleVersions}
    />
  );
}
