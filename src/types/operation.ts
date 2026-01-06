// ═══════════════════════════════════════════════════════════════════════════════
// OPERATION TYPES
// Types related to operations performed on project data
// ═══════════════════════════════════════════════════════════════════════════════

import type { User } from "./common";

/**
 * Operation type - categorizes the kind of operation
 */
export type OperationType =
  | "table_action"
  | "column_action"
  | "table_operation";

/**
 * Operation entity - represents a single operation performed on project data
 */
export interface Operation {
  operation_log_id: string;
  operation_type: OperationType;
  operation_name: string; // e.g., 'log_transform', 'merge_tables', 'upload_data'
  input_parameters: Record<string, unknown>;
  executed_by: User;
  execution_timestamp: string; // ISO 8601
  affected_table: string;
  output_table_version: string | null;
}
