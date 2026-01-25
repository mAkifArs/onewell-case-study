// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES EXPORTS
// Central export point for API services and repositories
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// REPOSITORY LAYER (Functional)
// Direct data access - synchronous, in-memory operations
// ─────────────────────────────────────────────────────────────────────────────────

export {
  // Factory functions (for testing and custom instances)
  createProjectRepository,
  createProjectTableRepository,
  createOperationRepository,
  createGovernanceRepository,
  createLineageRepository,
  // Type exports
  type ProjectRepository,
  type ProjectTableRepository,
  type OperationRepository,
  type GovernanceRepository,
  type LineageRepository,
  // Singleton instances
  projectRepository,
  projectTableRepository,
  operationRepository,
  governanceRepository,
  lineageRepository,
} from "./repository";

// ─────────────────────────────────────────────────────────────────────────────────
// API LAYER (Functional)
// Async functions with network simulation - wraps repository layer
// ─────────────────────────────────────────────────────────────────────────────────

export {
  // Functional API functions
  fetchAllProjects,
  fetchProjectById,
  duplicateProject,
  fetchProjectTables,
  fetchProjectOperations,
  fetchProjectGovernance,
  fetchProjectLineage,
  // Object-based API (for backward compatibility)
  projectApi,
  projectTableApi,
  operationApi,
  governanceApi,
  lineageApi,
  // Composite operations
  fetchProjectDashboardData,
  // Legacy (deprecated)
  fetchProjects,
} from "./api";
