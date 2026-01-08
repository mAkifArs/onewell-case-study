// ═══════════════════════════════════════════════════════════════════════════════
// PANEL INFO CONSTANTS
// Tooltip/help text descriptions for dashboard panels
// ═══════════════════════════════════════════════════════════════════════════════

export const PanelInfo = {
  DATA_TABLES:
    "View all source and derived tables in this project. Expand rows to see column details with their roles. Click version history to see table evolution.",
  OPERATIONS:
    "Timeline of recent data transformations and operations performed on project tables, grouped by date.",
  GOVERNANCE:
    "Track approval workflows, compliance checklist progress, and project stakeholders.",
  LINEAGE:
    "Visual representation of data flow. Source tables on the left feed into derived tables on the right. Click a table to highlight its upstream dependencies.",
} as const;

export type PanelInfoKey = keyof typeof PanelInfo;
