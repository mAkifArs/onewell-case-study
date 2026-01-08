// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES EXPORTS
// Central export point for all API services
// ═══════════════════════════════════════════════════════════════════════════════

// API Layer - async functions with network simulation
export {
  fetchProjects,
  fetchProjectById,
  fetchProjectTables,
  fetchProjectOperations,
  fetchProjectGovernance,
  fetchProjectLineage,
  fetchProjectDashboardData,
} from "./api";

// Repository Layer - direct data access (for internal use or testing)
export * as repository from "./repository";
