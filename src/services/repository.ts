// ═══════════════════════════════════════════════════════════════════════════════
// REPOSITORY LAYER
// Functional repositories for data access on domain entities
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

// Private state - using closure to encapsulate the data store
export function createProjectRepository(initialData: Project[] = projectsData) {
  const items = new Map<string, Project>();
  initialData.forEach((project) => {
    items.set(project.project_id, project);
  });

  return {
    /**
     * Get all projects
     */
    getAll: (): Project[] => {
      return Array.from(items.values());
    },

    /**
     * Find a project by ID - O(1) lookup
     */
    findById: (id: string): Project | null => {
      return items.get(id) ?? null;
    },

    /**
     * Add a new project to the repository
     */
    add: (project: Project): void => {
      items.set(project.project_id, project);
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────────
// PROJECT TABLE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

export function createProjectTableRepository(
  initialData: Record<string, ProjectTable[]> = projectTablesData
) {
  const items = new Map<string, ProjectTable[]>();
  Object.entries(initialData).forEach(([key, value]) => {
    items.set(key, value);
  });

  return {
    /**
     * Get all tables for a project
     */
    getByProjectId: (projectId: string): ProjectTable[] => {
      return items.get(projectId) ?? [];
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────────
// OPERATION REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

export function createOperationRepository(
  initialData: Record<string, Operation[]> = recentOperationsData
) {
  const items = new Map<string, Operation[]>();
  Object.entries(initialData).forEach(([key, value]) => {
    items.set(key, value);
  });

  return {
    /**
     * Get operations for a project
     * @param limit - Maximum number of operations to return (default: 10)
     */
    getByProjectId: (projectId: string, limit: number = 10): Operation[] => {
      const operations = items.get(projectId) ?? [];
      return operations.slice(0, limit);
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────────
// GOVERNANCE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

export function createGovernanceRepository(
  initialData: Record<string, Governance> = governanceData
) {
  const items = new Map<string, Governance>();
  Object.entries(initialData).forEach(([key, value]) => {
    items.set(key, value);
  });

  return {
    /**
     * Get governance data for a project
     */
    getByProjectId: (projectId: string): Governance | null => {
      return items.get(projectId) ?? null;
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────────
// LINEAGE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

export function createLineageRepository(
  initialData: Record<string, LineageRelation[]> = tableLineageData
) {
  const items = new Map<string, LineageRelation[]>();
  Object.entries(initialData).forEach(([key, value]) => {
    items.set(key, value);
  });

  return {
    /**
     * Get all lineage relations for a project
     */
    getByProjectId: (projectId: string): LineageRelation[] => {
      return items.get(projectId) ?? [];
    },
  };
};


export function duplicateProject(projectId: string) {
  const {findById,add} = createProjectRepository()
  const selectedProject = findById(projectId)
  if (!selectedProject) {
    throw new Error("Project not found")
  }
  const  newProject: Project = {
    ...selectedProject,
    project_id: "newProject",
    project_name: `Copy of ${selectedProject.project_name}`
  } 
  add(newProject)
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCES
// Export pre-initialized repository instances for application-wide use
// ═══════════════════════════════════════════════════════════════════════════════

export const projectRepository = createProjectRepository();
export const projectTableRepository = createProjectTableRepository();
export const operationRepository = createOperationRepository();
export const governanceRepository = createGovernanceRepository();
export const lineageRepository = createLineageRepository();

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS (for backward compatibility if needed)
// ─────────────────────────────────────────────────────────────────────────────────

export type ProjectRepository = ReturnType<typeof createProjectRepository>;
export type ProjectTableRepository = ReturnType<
  typeof createProjectTableRepository
>;
export type OperationRepository = ReturnType<typeof createOperationRepository>;
export type GovernanceRepository = ReturnType<
  typeof createGovernanceRepository
>;
export type LineageRepository = ReturnType<typeof createLineageRepository>;
