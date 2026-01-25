// ═══════════════════════════════════════════════════════════════════════════════
// API LAYER
// Functional API services that wrap repositories with network simulation
// Handles async operations, request deduplication, and error simulation
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  Project,
  ProjectTable,
  Operation,
  Governance,
  LineageRelation,
} from "../types";
import {
  projectRepository,
  projectTableRepository,
  operationRepository,
  governanceRepository,
  lineageRepository,
  type ProjectRepository,
  type ProjectTableRepository,
  type OperationRepository,
  type GovernanceRepository,
  type LineageRepository,
} from "./repository";

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const API_CONFIG = {
  delay: { min: 300, max: 800 },
  failureRate: 0, // Set to 0.05 for 5% failure rate
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// SHARED API UTILITIES
// Common functionality for all API services
// ─────────────────────────────────────────────────────────────────────────────────

// Request deduplication cache - shared across all API functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Simulate network delay
 */
async function simulateDelay(): Promise<void> {
  const delay =
    Math.random() * (API_CONFIG.delay.max - API_CONFIG.delay.min) +
    API_CONFIG.delay.min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Optionally throw a simulated network error
 */
async function maybeThrowError(): Promise<void> {
  if (API_CONFIG.failureRate > 0 && Math.random() < API_CONFIG.failureRate) {
    throw new Error("Simulated network error. Please try again.");
  }
}

/**
 * Wrap an async function with request deduplication
 */
function deduplicate<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const request = requestFn().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, request);
  return request;
}

/**
 * Execute a request with delay, error simulation, and deduplication
 */
function execute<T>(key: string, fn: () => T): Promise<T> {
  return deduplicate(key, async () => {
    await simulateDelay();
    await maybeThrowError();
    return fn();
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /projects - Fetch all projects
 */
export function fetchAllProjects(
  repository: ProjectRepository = projectRepository
): Promise<Project[]> {
  return execute("projects", () => repository.getAll());
}

/**
 * GET /projects/:id - Fetch a single project
 */
export function fetchProjectById(
  id: string,
  repository: ProjectRepository = projectRepository
): Promise<Project | null> {
  return execute(`project:${id}`, () => repository.findById(id));
}

/**
 * POST /projects/:id/duplicate - Duplicate a project
 * Creates a new project based on an existing one with a new ID and "Copy of" prefix
 */
export function duplicateProject(
  id: string,
  repository: ProjectRepository = projectRepository
): Promise<Project> {
  return execute(`duplicate:${id}`, () => {
    const original = repository.findById(id);
    if (!original) {
      throw new Error(`Project with id ${id} not found`);
    }

    // Generate new project ID (increment the number part)
    const allProjects = repository.getAll();
    const maxId = allProjects.reduce((max, p) => {
      const match = p.project_id.match(/^proj-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(max, num);
      }
      return max;
    }, 0);
    const newId = `proj-${String(maxId + 1).padStart(3, "0")}`;

    // Create duplicate with new ID, modified name, Draft status, and current timestamps
    const now = new Date().toISOString();
    const duplicate: Project = {
      ...original,
      project_id: newId,
      project_name: `Copy of ${original.project_name}`,
      created_at: now,
      updated_at: now,
    };

    // Add to repository
    repository.add(duplicate);

    return duplicate;
  });
}

// ─────────────────────────────────────────────────────────────────────────────────
// PROJECT TABLE API
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * GET /projects/:id/tables - Fetch all tables for a project
 */
export function fetchProjectTables(
  projectId: string,
  repository: ProjectTableRepository = projectTableRepository
): Promise<ProjectTable[]> {
  return execute(`tables:${projectId}`, () =>
    repository.getByProjectId(projectId)
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// OPERATION API
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * GET /projects/:id/operations - Fetch recent operations (limited)
 */
export function fetchProjectOperations(
  projectId: string,
  limit: number = 10,
  repository: OperationRepository = operationRepository
): Promise<Operation[]> {
  return execute(`operations:${projectId}:${limit}`, () =>
    repository.getByProjectId(projectId, limit)
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// GOVERNANCE API
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * GET /projects/:id/governance - Fetch governance data
 */
export function fetchProjectGovernance(
  projectId: string,
  repository: GovernanceRepository = governanceRepository
): Promise<Governance | null> {
  return execute(`governance:${projectId}`, () =>
    repository.getByProjectId(projectId)
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// LINEAGE API
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * GET /projects/:id/lineage - Fetch lineage data
 */
export function fetchProjectLineage(
  projectId: string,
  repository: LineageRepository = lineageRepository
): Promise<LineageRelation[]> {
  return execute(`lineage:${projectId}`, () =>
    repository.getByProjectId(projectId)
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITE API
// Complex operations that span multiple repositories
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetches all data for a project dashboard in parallel
 * Uses Promise.allSettled to handle partial failures gracefully
 */
export async function fetchProjectDashboardData(projectId: string): Promise<{
  project: Project | null;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];
  errors: Record<string, string>;
}> {
  const results = await Promise.allSettled([
    fetchProjectById(projectId),
    fetchProjectTables(projectId),
    fetchProjectOperations(projectId),
    fetchProjectGovernance(projectId),
    fetchProjectLineage(projectId),
  ]);

  const errors: Record<string, string> = {};

  const project = results[0].status === "fulfilled" ? results[0].value : null;
  if (results[0].status === "rejected") {
    errors.project = results[0].reason?.message ?? "Failed to load project";
  }

  const tables = results[1].status === "fulfilled" ? results[1].value : [];
  if (results[1].status === "rejected") {
    errors.tables = results[1].reason?.message ?? "Failed to load tables";
  }

  const operations = results[2].status === "fulfilled" ? results[2].value : [];
  if (results[2].status === "rejected") {
    errors.operations =
      results[2].reason?.message ?? "Failed to load operations";
  }

  const governance =
    results[3].status === "fulfilled" ? results[3].value : null;
  if (results[3].status === "rejected") {
    errors.governance =
      results[3].reason?.message ?? "Failed to load governance";
  }

  const lineage = results[4].status === "fulfilled" ? results[4].value : [];
  if (results[4].status === "rejected") {
    errors.lineage = results[4].reason?.message ?? "Failed to load lineage";
  }

  return { project, tables, operations, governance, lineage, errors };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY EXPORTS (for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

/** @deprecated Use fetchAllProjects() instead */
export function fetchProjects(): Promise<Project[]> {
  return fetchAllProjects();
}

// ─────────────────────────────────────────────────────────────────────────────────
// OBJECT-BASED API (for backward compatibility with existing code)
// Provides the same interface as the old class-based API
// ─────────────────────────────────────────────────────────────────────────────────

export const projectApi = {
  fetchAll: () => fetchAllProjects(),
  fetchById: (id: string) => fetchProjectById(id),
  duplicateById: (id: string) => duplicateProject(id),
};

export const projectTableApi = {
  fetchByProjectId: (projectId: string) => fetchProjectTables(projectId),
};

export const operationApi = {
  fetchByProjectId: (projectId: string, limit?: number) =>
    fetchProjectOperations(projectId, limit),
};

export const governanceApi = {
  fetchByProjectId: (projectId: string) => fetchProjectGovernance(projectId),
};

export const lineageApi = {
  fetchByProjectId: (projectId: string) => fetchProjectLineage(projectId),
};
