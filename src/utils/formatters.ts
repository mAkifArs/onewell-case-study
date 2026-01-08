// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTERS
// Only what we actually need for this dashboard
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cached Intl.NumberFormat for compact number formatting.
 * Created once, reused for all calls.
 */
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * Format a number in compact form: 50000 => "50K"
 */
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

/**
 * Format percentage: 65 => "65%"
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Convert snake_case to Title Case: "log_transform" => "Log Transform"
 */
export function toTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Format version number: 3 => "v3"
 */
export function formatVersion(versionNumber: number): string {
  return `v${versionNumber}`;
}

/**
 * Column role display labels
 */
const ROLE_LABELS = {
  exog: "Predictor",
  endog: "Target",
  not_used: "Not Used",
  time_id: "Time ID",
  lookup: "Lookup",
} as const;

export function formatColumnRole(
  role: "exog" | "endog" | "not_used" | "time_id" | "lookup"
): string {
  return ROLE_LABELS[role];
}

/**
 * Format approval type: "DevCompletion" => "Dev Completion"
 * Adds space before each capital letter
 */
export function formatApprovalType(type: string): string {
  return type.replace(/([A-Z])/g, " $1").trim();
}
