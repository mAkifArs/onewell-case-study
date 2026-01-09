// ═══════════════════════════════════════════════════════════════════════════════
// API LAYER
// Class-based API services that wrap repositories with network simulation
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
// BASE API CLASS
// Common functionality for all API services
// ─────────────────────────────────────────────────────────────────────────────────

abstract class BaseApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static inFlightRequests = new Map<string, Promise<any>>();

  /**
   * Simulate network delay
   */
  protected async simulateDelay(): Promise<void> {
    const delay =
      Math.random() * (API_CONFIG.delay.max - API_CONFIG.delay.min) +
      API_CONFIG.delay.min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Optionally throw a simulated network error
   */
  protected async maybeThrowError(): Promise<void> {
    if (API_CONFIG.failureRate > 0 && Math.random() < API_CONFIG.failureRate) {
      throw new Error("Simulated network error. Please try again.");
    }
  }

  /**
   * Wrap an async function with request deduplication
   */
  protected deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const existing = BaseApi.inFlightRequests.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const request = requestFn().finally(() => {
      BaseApi.inFlightRequests.delete(key);
    });

    BaseApi.inFlightRequests.set(key, request);
    return request;
  }

  /**
   * Execute a request with delay, error simulation, and deduplication
   */
  protected async execute<T>(key: string, fn: () => T): Promise<T> {
    return this.deduplicate(key, async () => {
      await this.simulateDelay();
      await this.maybeThrowError();
      return fn();
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT API
// ═══════════════════════════════════════════════════════════════════════════════

export class ProjectApi extends BaseApi {
  constructor(
    private readonly repository: ProjectRepository = projectRepository
  ) {
    super();
  }

  /**
   * GET /projects - Fetch all projects
   */
  public fetchAll(): Promise<Project[]> {
    return this.execute("projects", () => this.repository.getAll());
  }

  /**
   * GET /projects/:id - Fetch a single project
   */
  public fetchById(id: string): Promise<Project | null> {
    return this.execute(`project:${id}`, () => this.repository.findById(id));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT TABLE API
// ═══════════════════════════════════════════════════════════════════════════════

export class ProjectTableApi extends BaseApi {
  constructor(
    private readonly repository: ProjectTableRepository = projectTableRepository
  ) {
    super();
  }

  /**
   * GET /projects/:id/tables - Fetch all tables for a project
   */
  public fetchByProjectId(projectId: string): Promise<ProjectTable[]> {
    return this.execute(`tables:${projectId}`, () =>
      this.repository.getByProjectId(projectId)
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPERATION API
// ═══════════════════════════════════════════════════════════════════════════════

export class OperationApi extends BaseApi {
  constructor(
    private readonly repository: OperationRepository = operationRepository
  ) {
    super();
  }

  /**
   * GET /projects/:id/operations - Fetch recent operations (limited)
   */
  public fetchByProjectId(
    projectId: string,
    limit: number = 10
  ): Promise<Operation[]> {
    return this.execute(`operations:${projectId}:${limit}`, () =>
      this.repository.getByProjectId(projectId, limit)
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE API
// ═══════════════════════════════════════════════════════════════════════════════

export class GovernanceApi extends BaseApi {
  constructor(
    private readonly repository: GovernanceRepository = governanceRepository
  ) {
    super();
  }

  /**
   * GET /projects/:id/governance - Fetch governance data
   */
  public fetchByProjectId(projectId: string): Promise<Governance | null> {
    return this.execute(`governance:${projectId}`, () =>
      this.repository.getByProjectId(projectId)
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE API
// ═══════════════════════════════════════════════════════════════════════════════

export class LineageApi extends BaseApi {
  constructor(
    private readonly repository: LineageRepository = lineageRepository
  ) {
    super();
  }

  /**
   * GET /projects/:id/lineage - Fetch lineage data
   */
  public fetchByProjectId(projectId: string): Promise<LineageRelation[]> {
    return this.execute(`lineage:${projectId}`, () =>
      this.repository.getByProjectId(projectId)
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCES
// Export pre-initialized API instances for application-wide use
// ═══════════════════════════════════════════════════════════════════════════════

export const projectApi = new ProjectApi();
export const projectTableApi = new ProjectTableApi();
export const operationApi = new OperationApi();
export const governanceApi = new GovernanceApi();
export const lineageApi = new LineageApi();

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
    projectApi.fetchById(projectId),
    projectTableApi.fetchByProjectId(projectId),
    operationApi.fetchByProjectId(projectId),
    governanceApi.fetchByProjectId(projectId),
    lineageApi.fetchByProjectId(projectId),
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
// LEGACY EXPORT (for backward compatibility with projectStore)
// ═══════════════════════════════════════════════════════════════════════════════

/** @deprecated Use projectApi.fetchAll() instead */
export function fetchProjects(): Promise<Project[]> {
  return projectApi.fetchAll();
}
