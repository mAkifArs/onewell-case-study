import { memo, useMemo, type ReactNode } from "react";
import { useDashboardOperations } from "@/hooks";
import { groupOperationsByDate } from "@/utils/operationUtils";
import { EmptyState } from "@/components/EmptyState";
import { OperationsList } from "./OperationsList";

/**
 * Operations timeline component - uses store directly.
 * Only re-renders when operations data changes.
 */
export const OperationsTimeline = memo(function OperationsTimeline(): ReactNode {
  const operations = useDashboardOperations();
  const groups = useMemo(() => groupOperationsByDate(operations), [operations]);

  if (operations.length === 0) {
    return <EmptyState message="No recent operations" />;
  }

  return <OperationsList groups={groups} />;
});
