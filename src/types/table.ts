// ═══════════════════════════════════════════════════════════════════════════════
// TABLE TYPES
// Types related to project tables, versions, and columns
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Table type - origin of the data
 */
export type TableType = "source" | "derived";

/**
 * Column role - determines how the column is used in modeling
 */
export type ColumnRole = "exog" | "endog" | "not_used" | "time_id" | "lookup";

/**
 * Data type - the underlying data type of a column
 */
export type DataType =
  | "string"
  | "numeric"
  | "datetime"
  | "categorical"
  | "boolean";

/**
 * Checkpoint type - marks significant versions in the data pipeline
 */
export type CheckpointType =
  | "raw_upload"
  | "user_manual"
  | "development_gate"
  | "validation_gate"
  | "production";

/**
 * Column entity - represents a single column in a table
 */
export interface Column {
  column_id: string;
  column_name: string;
  display_name: string;
  data_type: DataType;
  role: ColumnRole;
}

/**
 * Table version entity - tracks changes to a table over time
 */
export interface TableVersion {
  table_version_id: string;
  version_number: number;
  row_count: number;
  column_count: number;
  is_materialized: boolean;
  checkpoint_type: CheckpointType | null;
  checkpoint_name?: string;
  parent_version_id: string | null;
  created_at: string; // ISO 8601
  created_by: string;
}

/**
 * Project table entity - a data table within a project
 */
export interface ProjectTable {
  project_table_id: string;
  table_name: string;
  display_name: string;
  table_type: TableType;
  current_version_id: string;
  versions: TableVersion[];
  columns: Column[];
}
