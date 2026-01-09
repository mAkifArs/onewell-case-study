// ═══════════════════════════════════════════════════════════════════════════════
// REPOSITORY LAYER
// Class-based repositories for data access on domain entities
// Each repository manages its own data collection with type-safe operations
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

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

export class ProjectRepository {
  private readonly items: Map<string, Project>;

  constructor(initialData: Project[] = projectsData) {
    this.items = new Map();
    initialData.forEach((project) => {
      this.items.set(project.project_id, project);
    });
  }

  /**
   * Get all projects
   */
  public getAll(): Project[] {
    return Array.from(this.items.values());
  }

  /**
   * Find a project by ID - O(1) lookup
   */
  public findById(id: string): Project | null {
    return this.items.get(id) ?? null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT TABLE REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

export class ProjectTableRepository {
  private readonly items: Map<string, ProjectTable[]>;

  constructor(initialData: Record<string, ProjectTable[]> = projectTablesData) {
    this.items = new Map(Object.entries(initialData));
  }

  /**
   * Get all tables for a project
   */
  public getByProjectId(projectId: string): ProjectTable[] {
    return this.items.get(projectId) ?? [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPERATION REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

export class OperationRepository {
  private readonly items: Map<string, Operation[]>;

  constructor(initialData: Record<string, Operation[]> = recentOperationsData) {
    this.items = new Map(Object.entries(initialData));
  }

  /**
   * Get operations for a project
   * @param limit - Maximum number of operations to return (default: 10)
   */
  public getByProjectId(projectId: string, limit: number = 10): Operation[] {
    const operations = this.items.get(projectId) ?? [];
    return operations.slice(0, limit);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

export class GovernanceRepository {
  private readonly items: Map<string, Governance>;

  constructor(initialData: Record<string, Governance> = governanceData) {
    this.items = new Map(Object.entries(initialData));
  }

  /**
   * Get governance data for a project
   */
  public getByProjectId(projectId: string): Governance | null {
    return this.items.get(projectId) ?? null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

export class LineageRepository {
  private readonly items: Map<string, LineageRelation[]>;

  constructor(
    initialData: Record<string, LineageRelation[]> = tableLineageData
  ) {
    this.items = new Map(Object.entries(initialData));
  }

  /**
   * Get all lineage relations for a project
   */
  public getByProjectId(projectId: string): LineageRelation[] {
    return this.items.get(projectId) ?? [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCES
// Export pre-initialized repository instances for application-wide use
// ═══════════════════════════════════════════════════════════════════════════════

export const projectRepository = new ProjectRepository();
export const projectTableRepository = new ProjectTableRepository();
export const operationRepository = new OperationRepository();
export const governanceRepository = new GovernanceRepository();
export const lineageRepository = new LineageRepository();
