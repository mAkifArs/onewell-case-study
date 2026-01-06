import type { ReactNode } from "react";
import { useMemo } from "react";
import type { Operation } from "@/types";
import { groupOperationsByDate } from "@/utils/operationUtils";
import { EmptyState } from "@/components/EmptyState";
import { OperationsList } from "./OperationsList";

interface OperationsTimelineProps {
  operations: Operation[];
}

export function OperationsTimeline({
  operations,
}: OperationsTimelineProps): ReactNode {
  const groups = useMemo(() => groupOperationsByDate(operations), [operations]);

  if (operations.length === 0) {
    return <EmptyState message="No recent operations" />;
  }

  return <OperationsList groups={groups} />;
}
