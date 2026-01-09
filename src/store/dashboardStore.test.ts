// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STORE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDashboardStore } from "./dashboardStore";
import type { Project, ProjectTable, Operation, Governance } from "@/types";

// Mock fetchProjectDashboardData
vi.mock("@/services", () => ({
  fetchProjectDashboardData: vi.fn(),
}));

import { fetchProjectDashboardData } from "@/services";

// ─────────────────────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────────────────────

const mockProject: Project = {
  project_id: "proj-1",
  project_name: "Test Project",
  project_type: "ML",
  status: "Active",
  owner: { user_id: "user-1", name: "Test User" },
  governance_manager: null,
  department: { department_id: "dept-1", name: "Risk" },
  is_segmented: false,
  objectives: "Test",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-15T00:00:00Z",
};

const mockTables: ProjectTable[] = [
  {
    project_table_id: "table-1",
    table_name: "customers",
    display_name: "Customers",
    table_type: "source",
    current_version_id: "v1",
    versions: [],
    columns: [],
  },
];

const mockOperations: Operation[] = [
  {
    operation_log_id: "op-1",
    operation_type: "table_action",
    operation_name: "test_op",
    input_parameters: {},
    executed_by: { user_id: "user-1", name: "Test User" },
    execution_timestamp: "2025-01-15T10:00:00Z",
    affected_table: "customers",
    output_table_version: null,
  },
];

const mockGovernance: Governance = {
  approvals: [],
  compliance_checklist: null,
  stakeholders: [],
};

const mockDashboardData = {
  project: mockProject,
  tables: mockTables,
  operations: mockOperations,
  governance: mockGovernance,
  lineage: [],
  errors: {},
};

// ─────────────────────────────────────────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────────────────────────────────────────

function resetStore() {
  useDashboardStore.setState({
    currentProjectId: null,
    project: null,
    tables: [],
    operations: [],
    governance: null,
    lineage: [],
    cache: {},
    isLoading: true,
    error: null,
    sectionErrors: {},
  });
}

describe("dashboardStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("starts with no project loaded", () => {
      const state = useDashboardStore.getState();
      expect(state.currentProjectId).toBeNull();
      expect(state.project).toBeNull();
    });

    it("starts with empty data arrays", () => {
      const state = useDashboardStore.getState();
      expect(state.tables).toEqual([]);
      expect(state.operations).toEqual([]);
      expect(state.lineage).toEqual([]);
    });

    it("starts with isLoading true", () => {
      expect(useDashboardStore.getState().isLoading).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // loadDashboard
  // ─────────────────────────────────────────────────────────────────────────────

  describe("loadDashboard", () => {
    it("fetches and stores dashboard data successfully", async () => {
      vi.mocked(fetchProjectDashboardData).mockResolvedValue(mockDashboardData);

      await useDashboardStore.getState().loadDashboard("proj-1");

      const state = useDashboardStore.getState();
      expect(state.currentProjectId).toBe("proj-1");
      expect(state.project).toEqual(mockProject);
      expect(state.tables).toEqual(mockTables);
      expect(state.operations).toEqual(mockOperations);
      expect(state.governance).toEqual(mockGovernance);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("caches successful fetches", async () => {
      vi.mocked(fetchProjectDashboardData).mockResolvedValue(mockDashboardData);

      await useDashboardStore.getState().loadDashboard("proj-1");

      const state = useDashboardStore.getState();
      expect(state.cache["proj-1"]).toBeDefined();
      expect(state.cache["proj-1"].project).toEqual(mockProject);
    });

    it("skips fetch if already loaded for same project", async () => {
      // Pre-load data
      useDashboardStore.setState({
        currentProjectId: "proj-1",
        project: mockProject,
      });

      await useDashboardStore.getState().loadDashboard("proj-1");

      expect(fetchProjectDashboardData).not.toHaveBeenCalled();
    });

    it("handles project not found", async () => {
      vi.mocked(fetchProjectDashboardData).mockResolvedValue({
        project: null,
        tables: [],
        operations: [],
        governance: null,
        lineage: [],
        errors: { project: "Project not found" },
      });

      await useDashboardStore.getState().loadDashboard("invalid-id");

      const state = useDashboardStore.getState();
      expect(state.error).toBe("Project not found");
      expect(state.project).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it("stores section errors for partial failures", async () => {
      vi.mocked(fetchProjectDashboardData).mockResolvedValue({
        project: mockProject,
        tables: [],
        operations: [],
        governance: null,
        lineage: [],
        errors: { tables: "Failed to load tables" },
      });

      await useDashboardStore.getState().loadDashboard("proj-1");

      const state = useDashboardStore.getState();
      expect(state.project).toEqual(mockProject);
      expect(state.sectionErrors.tables).toBe("Failed to load tables");
    });

    it("uses cache when offline", async () => {
      // Set up cache
      useDashboardStore.setState({
        cache: {
          "proj-1": {
            project: mockProject,
            tables: mockTables,
            operations: mockOperations,
            governance: mockGovernance,
            lineage: [],
            cachedAt: Date.now(),
          },
        },
      });

      Object.defineProperty(navigator, "onLine", { value: false });

      await useDashboardStore.getState().loadDashboard("proj-1");

      const state = useDashboardStore.getState();
      expect(state.project).toEqual(mockProject);
      expect(fetchProjectDashboardData).not.toHaveBeenCalled();
    });

    it("shows error when offline with no cache", async () => {
      Object.defineProperty(navigator, "onLine", { value: false });

      await useDashboardStore.getState().loadDashboard("proj-1");

      const state = useDashboardStore.getState();
      expect(state.error).toBe(
        "No internet connection and no cached data for this project"
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // clearDashboard
  // ─────────────────────────────────────────────────────────────────────────────

  describe("clearDashboard", () => {
    it("resets all dashboard data", () => {
      useDashboardStore.setState({
        currentProjectId: "proj-1",
        project: mockProject,
        tables: mockTables,
        operations: mockOperations,
        error: "Some error",
      });

      useDashboardStore.getState().clearDashboard();

      const state = useDashboardStore.getState();
      expect(state.currentProjectId).toBeNull();
      expect(state.project).toBeNull();
      expect(state.tables).toEqual([]);
      expect(state.operations).toEqual([]);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(true);
    });

    it("preserves cache when clearing", () => {
      const cachedData = {
        project: mockProject,
        tables: mockTables,
        operations: mockOperations,
        governance: mockGovernance,
        lineage: [],
        cachedAt: Date.now(),
      };

      useDashboardStore.setState({
        currentProjectId: "proj-1",
        project: mockProject,
        cache: { "proj-1": cachedData },
      });

      useDashboardStore.getState().clearDashboard();

      const state = useDashboardStore.getState();
      expect(state.cache["proj-1"]).toEqual(cachedData);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // clearError
  // ─────────────────────────────────────────────────────────────────────────────

  describe("clearError", () => {
    it("clears error and sectionErrors", () => {
      useDashboardStore.setState({
        error: "Some error",
        sectionErrors: { tables: "Table error" },
      });

      useDashboardStore.getState().clearError();

      const state = useDashboardStore.getState();
      expect(state.error).toBeNull();
      expect(state.sectionErrors).toEqual({});
    });
  });
});




