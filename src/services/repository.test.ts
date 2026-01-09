// ═══════════════════════════════════════════════════════════════════════════════
// REPOSITORY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  ProjectRepository,
  ProjectTableRepository,
  OperationRepository,
  GovernanceRepository,
  LineageRepository,
} from "./repository";
import type {
  Project,
  ProjectTable,
  Operation,
  Governance,
  LineageRelation,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────────
// TEST DATA FACTORIES
// ─────────────────────────────────────────────────────────────────────────────────

function createProject(id: string, name: string): Project {
  return {
    project_id: id,
    project_name: name,
    project_type: "ML",
    status: "Active",
    owner: { user_id: "user-1", name: "Test User" },
    governance_manager: null,
    department: { department_id: "dept-1", name: "Risk" },
    is_segmented: false,
    objectives: "Test objectives",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  };
}

function createTable(id: string, name: string): ProjectTable {
  return {
    project_table_id: id,
    table_name: name,
    display_name: name,
    table_type: "source",
    current_version_id: "v1",
    versions: [],
    columns: [],
  };
}

function createOperation(id: string, timestamp: string): Operation {
  return {
    operation_log_id: id,
    operation_type: "table_action",
    operation_name: "test_op",
    input_parameters: {},
    executed_by: { user_id: "user-1", name: "Test User" },
    execution_timestamp: timestamp,
    affected_table: "test_table",
    output_table_version: null,
  };
}

function createGovernance(): Governance {
  return {
    approvals: [
      {
        approval_id: "app-1",
        approval_type: "DevCompletion",
        status: "Pending",
        approver: { user_id: "user-1", name: "Approver" },
        comments: null,
      },
    ],
    compliance_checklist: null,
    stakeholders: [],
  };
}

function createLineageRelation(
  parent: string,
  child: string
): LineageRelation {
  return {
    parent_table: parent,
    child_table: child,
    parent_type: "source_dataset",
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// PROJECT REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

describe("ProjectRepository", () => {
  describe("getAll", () => {
    it("returns all projects", () => {
      const projects = [
        createProject("proj-1", "Project 1"),
        createProject("proj-2", "Project 2"),
      ];
      const repo = new ProjectRepository(projects);

      const result = repo.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].project_id).toBe("proj-1");
      expect(result[1].project_id).toBe("proj-2");
    });

    it("returns empty array when no projects", () => {
      const repo = new ProjectRepository([]);
      expect(repo.getAll()).toEqual([]);
    });
  });

  describe("findById", () => {
    it("returns project when found", () => {
      const projects = [createProject("proj-1", "Project 1")];
      const repo = new ProjectRepository(projects);

      const result = repo.findById("proj-1");

      expect(result).not.toBeNull();
      expect(result?.project_name).toBe("Project 1");
    });

    it("returns null when not found", () => {
      const repo = new ProjectRepository([]);
      expect(repo.findById("non-existent")).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// PROJECT TABLE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

describe("ProjectTableRepository", () => {
  describe("getByProjectId", () => {
    it("returns tables for existing project", () => {
      const data = {
        "proj-1": [createTable("t-1", "customers"), createTable("t-2", "orders")],
      };
      const repo = new ProjectTableRepository(data);

      const result = repo.getByProjectId("proj-1");

      expect(result).toHaveLength(2);
      expect(result[0].table_name).toBe("customers");
    });

    it("returns empty array for unknown project", () => {
      const repo = new ProjectTableRepository({});
      expect(repo.getByProjectId("unknown")).toEqual([]);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// OPERATION REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

describe("OperationRepository", () => {
  describe("getByProjectId", () => {
    it("returns operations with default limit of 10", () => {
      const operations = Array.from({ length: 15 }, (_, i) =>
        createOperation(`op-${i}`, `2025-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`)
      );
      const repo = new OperationRepository({ "proj-1": operations });

      const result = repo.getByProjectId("proj-1");

      expect(result).toHaveLength(10);
    });

    it("respects custom limit", () => {
      const operations = Array.from({ length: 15 }, (_, i) =>
        createOperation(`op-${i}`, `2025-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`)
      );
      const repo = new OperationRepository({ "proj-1": operations });

      expect(repo.getByProjectId("proj-1", 5)).toHaveLength(5);
      expect(repo.getByProjectId("proj-1", 20)).toHaveLength(15);
    });

    it("returns empty array for unknown project", () => {
      const repo = new OperationRepository({});
      expect(repo.getByProjectId("unknown")).toEqual([]);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// GOVERNANCE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

describe("GovernanceRepository", () => {
  describe("getByProjectId", () => {
    it("returns governance data when exists", () => {
      const governance = createGovernance();
      const repo = new GovernanceRepository({ "proj-1": governance });

      const result = repo.getByProjectId("proj-1");

      expect(result).not.toBeNull();
      expect(result?.approvals).toHaveLength(1);
    });

    it("returns null when not found", () => {
      const repo = new GovernanceRepository({});
      expect(repo.getByProjectId("unknown")).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// LINEAGE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────────

describe("LineageRepository", () => {
  describe("getByProjectId", () => {
    it("returns lineage relations when exists", () => {
      const relations = [
        createLineageRelation("source", "derived"),
        createLineageRelation("source2", "derived"),
      ];
      const repo = new LineageRepository({ "proj-1": relations });

      const result = repo.getByProjectId("proj-1");

      expect(result).toHaveLength(2);
      expect(result[0].parent_table).toBe("source");
      expect(result[0].child_table).toBe("derived");
    });

    it("returns empty array for unknown project", () => {
      const repo = new LineageRepository({});
      expect(repo.getByProjectId("unknown")).toEqual([]);
    });
  });
});

