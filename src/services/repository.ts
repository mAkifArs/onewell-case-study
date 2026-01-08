// ═══════════════════════════════════════════════════════════════════════════════
// DATA REPOSITORY
// Handles data access, filtering, and caching from JSON data source
// This layer is responsible for all data manipulation logic
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  Project,
  ProjectTable,
  Operation,
  Governance,
  LineageRelation,
} from "../types";
import data from "../data/data.json";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE CASTING
// JSON imports need proper typing - using unknown as intermediate cast
// ─────────────────────────────────────────────────────────────────────────────────

const projectsData = data.projects as unknown as Project[];
const projectTablesData = data.project_tables as unknown as Record<
  string,
  ProjectTable[]
>;
const recentOperationsData = data.recent_operations as unknown as Record<
  string,
  Operation[]
>;
const governanceData = data.governance as unknown as Record<string, Governance>;
const tableLineageData = data.table_lineage as unknown as Record<
  string,
  LineageRelation[]
>;

// ─────────────────────────────────────────────────────────────────────────────────
// CACHE
// In-memory cache for frequently accessed data
// ─────────────────────────────────────────────────────────────────────────────────

const projectCache = new Map<string, Project>();

// Pre-populate project cache for O(1) lookups
projectsData.forEach((project) => {
  projectCache.set(project.project_id, project);
});

// ─────────────────────────────────────────────────────────────────────────────────
// REPOSITORY METHODS
// Pure data access - no async, no network simulation
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Get all projects
 */
export function getAllProjects(): Project[] {
  return projectsData;
}

/**
 * Get a single project by ID
 * Uses cached Map for O(1) lookup instead of O(n) array search
 */
export function getProjectById(id: string): Project | null {
  return projectCache.get(id) ?? null;
}

/**
 * Get all tables for a project
 */
export function getProjectTables(projectId: string): ProjectTable[] {
  return projectTablesData[projectId] ?? [];
}

/**
 * Get recent operations for a project
 * @param limit - Maximum number of operations to return (default: 10)
 */
export function getProjectOperations(
  projectId: string,
  limit: number = 10
): Operation[] {
  const operations = recentOperationsData[projectId] ?? [];
  return operations.slice(0, limit);
}

/**
 * Get governance data for a project
 */
export function getProjectGovernance(projectId: string): Governance | null {
  return governanceData[projectId] ?? null;
}

/**
 * Get table lineage data for a project
 */
export function getProjectLineage(projectId: string): LineageRelation[] {
  return tableLineageData[projectId] ?? [];
}

/**
 * Check if a project exists
 */
export function projectExists(projectId: string): boolean {
  return projectCache.has(projectId);
}

/**
 * Get project IDs that have data
 */
export function getAvailableProjectIds(): string[] {
  return Array.from(projectCache.keys());
}
