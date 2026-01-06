// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE TYPES
// Types related to data lineage and table relationships
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lineage relation entity - defines parent-child relationships between tables
 */
export interface LineageRelation {
  child_table: string; // table_name of derived table
  parent_table: string; // table_name of source table
  parent_type: string; // 'source_dataset'
}
