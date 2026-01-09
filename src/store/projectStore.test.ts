// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT STORE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useProjectStore } from "./projectStore";
import type { Project } from "@/types";

// Mock fetchProjects
vi.mock("@/services", () => ({
  fetchProjects: vi.fn(),
}));

import { fetchProjects } from "@/services";

// ─────────────────────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────────────────────

const mockProjects: Project[] = [
  {
    project_id: "proj-1",
    project_name: "Test Project 1",
    project_type: "ML",
    status: "Active",
    owner: { user_id: "user-1", name: "Test User" },
    governance_manager: null,
    department: { department_id: "dept-1", name: "Risk" },
    is_segmented: false,
    objectives: "Test",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    project_id: "proj-2",
    project_name: "Test Project 2",
    project_type: "AI",
    status: "Draft",
    owner: { user_id: "user-1", name: "Test User" },
    governance_manager: null,
    department: { department_id: "dept-1", name: "Risk" },
    is_segmented: false,
    objectives: "Test",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────────────────────────────────────────

// Reset store state before each test
function resetStore() {
  useProjectStore.setState({
    projects: [],
    isLoading: true,
    error: null,
    selectedProjectId: null,
  });
}

// Store original localStorage methods
const originalGetItem = localStorage.getItem.bind(localStorage);
const originalSetItem = localStorage.setItem.bind(localStorage);

describe("projectStore", () => {
  let getItemMock: ReturnType<typeof vi.fn>;
  let setItemMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    
    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
    
    // Mock localStorage methods directly
    getItemMock = vi.fn().mockReturnValue(null);
    setItemMock = vi.fn();
    localStorage.getItem = getItemMock;
    localStorage.setItem = setItemMock;
  });

  afterEach(() => {
    // Restore original localStorage methods
    localStorage.getItem = originalGetItem;
    localStorage.setItem = originalSetItem;
    vi.restoreAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("starts with empty projects array", () => {
      const state = useProjectStore.getState();
      expect(state.projects).toEqual([]);
    });

    it("starts with isLoading true", () => {
      const state = useProjectStore.getState();
      expect(state.isLoading).toBe(true);
    });

    it("starts with no error", () => {
      const state = useProjectStore.getState();
      expect(state.error).toBeNull();
    });

    it("starts with no selected project", () => {
      const state = useProjectStore.getState();
      expect(state.selectedProjectId).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // loadProjects
  // ─────────────────────────────────────────────────────────────────────────────

  describe("loadProjects", () => {
    it("fetches and stores projects successfully", async () => {
      vi.mocked(fetchProjects).mockResolvedValue(mockProjects);

      await useProjectStore.getState().loadProjects();

      const state = useProjectStore.getState();
      expect(state.projects).toEqual(mockProjects);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("saves projects to localStorage for offline use", async () => {
      vi.mocked(fetchProjects).mockResolvedValue(mockProjects);

      await useProjectStore.getState().loadProjects();

      expect(setItemMock).toHaveBeenCalledWith(
        "onewell-offline-projects",
        JSON.stringify(mockProjects)
      );
    });

    it("sets error on fetch failure", async () => {
      vi.mocked(fetchProjects).mockRejectedValue(new Error("Network error"));

      await useProjectStore.getState().loadProjects();

      const state = useProjectStore.getState();
      expect(state.error).toBe("Network error");
      expect(state.isLoading).toBe(false);
    });

    it("skips fetch if projects already loaded", async () => {
      // Pre-populate projects
      useProjectStore.setState({ projects: mockProjects });

      await useProjectStore.getState().loadProjects();

      expect(fetchProjects).not.toHaveBeenCalled();
    });

    it("loads from localStorage when offline", async () => {
      Object.defineProperty(navigator, "onLine", { value: false });
      getItemMock.mockReturnValue(JSON.stringify(mockProjects));

      await useProjectStore.getState().loadProjects();

      const state = useProjectStore.getState();
      expect(state.projects).toEqual(mockProjects);
      expect(fetchProjects).not.toHaveBeenCalled();
    });

    it("sets error when offline with no cached data", async () => {
      // Set offline mode
      Object.defineProperty(navigator, "onLine", { value: false });
      // getItemMock already returns null by default

      await useProjectStore.getState().loadProjects();

      const state = useProjectStore.getState();
      expect(state.error).toBe(
        "No internet connection and no cached data available"
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // selectProject
  // ─────────────────────────────────────────────────────────────────────────────

  describe("selectProject", () => {
    it("sets selectedProjectId", () => {
      useProjectStore.getState().selectProject("proj-1");

      expect(useProjectStore.getState().selectedProjectId).toBe("proj-1");
    });

    it("can set to null", () => {
      useProjectStore.setState({ selectedProjectId: "proj-1" });
      useProjectStore.getState().selectProject(null);

      expect(useProjectStore.getState().selectedProjectId).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // clearSelection
  // ─────────────────────────────────────────────────────────────────────────────

  describe("clearSelection", () => {
    it("clears the selected project", () => {
      useProjectStore.setState({ selectedProjectId: "proj-1" });
      useProjectStore.getState().clearSelection();

      expect(useProjectStore.getState().selectedProjectId).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // clearError
  // ─────────────────────────────────────────────────────────────────────────────

  describe("clearError", () => {
    it("clears the error state", () => {
      useProjectStore.setState({ error: "Some error" });
      useProjectStore.getState().clearError();

      expect(useProjectStore.getState().error).toBeNull();
    });
  });
});




