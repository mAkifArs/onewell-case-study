// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE
// Mock API layer with simulated network delays
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
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const SIMULATED_DELAY = {
  min: 200,
  max: 800,
};

// Set to 0 to disable error simulation, or 0.05 for 5% failure rate
const FAILURE_RATE = 0;

// ─────────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Simulates network delay with random duration
 */
async function simulateDelay(): Promise<void> {
  const delay =
    Math.random() * (SIMULATED_DELAY.max - SIMULATED_DELAY.min) +
    SIMULATED_DELAY.min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Optionally throws a simulated network error
 */
async function maybeThrowError(): Promise<void> {
  if (FAILURE_RATE > 0 && Math.random() < FAILURE_RATE) {
    throw new Error("Simulated network error. Please try again.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE CASTING HELPERS
// JSON imports need proper typing - using unknown as intermediate cast
// because JSON structure may have optional fields omitted
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
// API ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * GET /projects
 * Fetches all projects
 */
export async function fetchProjects(): Promise<Project[]> {
  await simulateDelay();
  await maybeThrowError();
  return projectsData;
}

/**
 * GET /projects/:id
 * Fetches a single project by ID
 */
export async function fetchProjectById(id: string): Promise<Project | null> {
  await simulateDelay();
  await maybeThrowError();
  return projectsData.find((p) => p.project_id === id) ?? null;
}

/**
 * GET /projects/:id/tables
 * Fetches all tables for a project
 */
export async function fetchProjectTables(
  projectId: string
): Promise<ProjectTable[]> {
  await simulateDelay();
  await maybeThrowError();
  return projectTablesData[projectId] ?? [];
}

/**
 * GET /projects/:id/operations
 * Fetches recent operations for a project (last 10)
 */
export async function fetchProjectOperations(
  projectId: string
): Promise<Operation[]> {
  await simulateDelay();
  await maybeThrowError();
  return (recentOperationsData[projectId] ?? []).slice(0, 10);
}

/**
 * GET /projects/:id/governance
 * Fetches governance data for a project
 */
export async function fetchProjectGovernance(
  projectId: string
): Promise<Governance | null> {
  await simulateDelay();
  await maybeThrowError();
  return governanceData[projectId] ?? null;
}

/**
 * GET /projects/:id/lineage
 * Fetches table lineage data for a project
 */
export async function fetchProjectLineage(
  projectId: string
): Promise<LineageRelation[]> {
  await simulateDelay();
  await maybeThrowError();
  return tableLineageData[projectId] ?? [];
}

/**
 * Fetches all data for a project dashboard in parallel
 * More efficient than sequential calls
 */
export async function fetchProjectDashboardData(projectId: string): Promise<{
  project: Project | null;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];
}> {
  const [project, tables, operations, governance, lineage] = await Promise.all([
    fetchProjectById(projectId),
    fetchProjectTables(projectId),
    fetchProjectOperations(projectId),
    fetchProjectGovernance(projectId),
    fetchProjectLineage(projectId),
  ]);

  return {
    project,
    tables,
    operations,
    governance,
    lineage,
  };
}
