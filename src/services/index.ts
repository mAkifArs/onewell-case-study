// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES EXPORTS
// Central export point for API services and repositories
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// REPOSITORY LAYER (Class-based)
// Direct data access - synchronous, in-memory operations
// ─────────────────────────────────────────────────────────────────────────────────

export {
  // Classes
  ProjectRepository,
  ProjectTableRepository,
  OperationRepository,
  GovernanceRepository,
  LineageRepository,
  // Singleton instances
  projectRepository,
  projectTableRepository,
  operationRepository,
  governanceRepository,
  lineageRepository,
} from "./repository";

// ─────────────────────────────────────────────────────────────────────────────────
// API LAYER (Class-based)
// Async functions with network simulation - wraps repository layer
// ─────────────────────────────────────────────────────────────────────────────────

export {
  // Classes
  ProjectApi,
  ProjectTableApi,
  OperationApi,
  GovernanceApi,
  LineageApi,
  // Singleton instances
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
