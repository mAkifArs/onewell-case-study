// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE
// Simulates network behavior (delays, errors) and calls the data repository
// This layer is responsible for async operations and error simulation only
// Includes request deduplication to prevent redundant simultaneous requests
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  Project,
  ProjectTable,
  Operation,
  Governance,
  LineageRelation,
} from "../types";
import * as repository from "./repository";

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const SIMULATED_DELAY = {
  min: 300,
  max: 800,
};

// Set to 0 to disable error simulation, or 0.05 for 5% failure rate
const FAILURE_RATE = 0;

// ─────────────────────────────────────────────────────────────────────────────────
// REQUEST DEDUPLICATION
// Tracks in-flight requests to prevent duplicate simultaneous calls
// If a request is already in progress, return the same promise
// ─────────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Wraps an async function with request deduplication.
 * If a request with the same key is already in flight, returns the existing promise.
 * Once the request completes, removes it from the in-flight map.
 */
function deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  // Check if this request is already in flight
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  // Create new request and track it
  const request = requestFn().finally(() => {
    // Remove from in-flight map when done (success or error)
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, request);
  return request;
}

// ─────────────────────────────────────────────────────────────────────────────────
// NETWORK SIMULATION HELPERS
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
// API ENDPOINTS
// Each function simulates a network call, then delegates to repository
// All functions are wrapped with deduplication to prevent redundant requests
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * GET /projects
 * Fetches all projects
 */
export function fetchProjects(): Promise<Project[]> {
  return deduplicate("projects", async () => {
    await simulateDelay();
    await maybeThrowError();
    return repository.getAllProjects();
  });
}

/**
 * GET /projects/:id
 * Fetches a single project by ID
 */
export function fetchProjectById(id: string): Promise<Project | null> {
  return deduplicate(`project:${id}`, async () => {
    await simulateDelay();
    await maybeThrowError();
    return repository.getProjectById(id);
  });
}

/**
 * GET /projects/:id/tables
 * Fetches all tables for a project
 */
export function fetchProjectTables(projectId: string): Promise<ProjectTable[]> {
  return deduplicate(`tables:${projectId}`, async () => {
    await simulateDelay();
    await maybeThrowError();
    return repository.getProjectTables(projectId);
  });
}

/**
 * GET /projects/:id/operations
 * Fetches recent operations for a project (last 10)
 */
export function fetchProjectOperations(
  projectId: string
): Promise<Operation[]> {
  return deduplicate(`operations:${projectId}`, async () => {
    await simulateDelay();
    await maybeThrowError();
    return repository.getProjectOperations(projectId, 10);
  });
}

/**
 * GET /projects/:id/governance
 * Fetches governance data for a project
 */
export function fetchProjectGovernance(
  projectId: string
): Promise<Governance | null> {
  return deduplicate(`governance:${projectId}`, async () => {
    await simulateDelay();
    await maybeThrowError();
    return repository.getProjectGovernance(projectId);
  });
}

/**
 * GET /projects/:id/lineage
 * Fetches table lineage data for a project
 */
export function fetchProjectLineage(
  projectId: string
): Promise<LineageRelation[]> {
  return deduplicate(`lineage:${projectId}`, async () => {
    await simulateDelay();
    await maybeThrowError();
    return repository.getProjectLineage(projectId);
  });
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPOSITE ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all data for a project dashboard in parallel
 * Uses Promise.allSettled to handle partial failures gracefully
 * - If some APIs fail, we still return data from successful calls
 * - Each panel can show its own error state independently
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

  // Extract values or set defaults for failed requests
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

  return {
    project,
    tables,
    operations,
    governance,
    lineage,
    errors,
  };
}
