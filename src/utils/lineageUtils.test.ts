// ═══════════════════════════════════════════════════════════════════════════════
// LINEAGE UTILS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { buildReactFlowGraph, getUpstreamTables } from "./lineageUtils";
import type { LineageRelation, ProjectTable } from "@/types";

// Factory for creating test tables
function createTable(
  name: string,
  type: "source" | "derived" = "source"
): ProjectTable {
  return {
    project_table_id: `table-${name}`,
    table_name: name,
    display_name: name.charAt(0).toUpperCase() + name.slice(1),
    table_type: type,
    current_version_id: "v1",
    versions: [],
    columns: [],
  };
}

// Factory for creating lineage relations
function createRelation(parent: string, child: string): LineageRelation {
  return {
    parent_table: parent,
    child_table: child,
    parent_type: "source_dataset",
  };
}

describe("lineageUtils", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // buildReactFlowGraph
  // ─────────────────────────────────────────────────────────────────────────────

  describe("buildReactFlowGraph", () => {
    it("returns empty graph for empty input", () => {
      const result = buildReactFlowGraph([], []);

      expect(result.nodes).toEqual([]);
      expect(result.edges).toEqual([]);
    });

    it("creates nodes for source tables without relations", () => {
      const tables = [createTable("customers", "source")];
      const result = buildReactFlowGraph([], tables);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe("customers");
      expect(result.nodes[0].data.tableType).toBe("source");
    });

    it("creates nodes and edges for simple relation", () => {
      const tables = [
        createTable("customers", "source"),
        createTable("derived_data", "derived"),
      ];
      const lineage = [createRelation("customers", "derived_data")];

      const result = buildReactFlowGraph(lineage, tables);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].source).toBe("customers");
      expect(result.edges[0].target).toBe("derived_data");
    });

    it("handles many-to-one relationships", () => {
      const tables = [
        createTable("customers", "source"),
        createTable("products", "source"),
        createTable("combined", "derived"),
      ];
      const lineage = [
        createRelation("customers", "combined"),
        createRelation("products", "combined"),
      ];

      const result = buildReactFlowGraph(lineage, tables);

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);

      // Two source tables
      const sources = result.nodes.filter(
        (n) => n.data.tableType === "source"
      );
      expect(sources).toHaveLength(2);

      // One derived table
      const derived = result.nodes.filter(
        (n) => n.data.tableType === "derived"
      );
      expect(derived).toHaveLength(1);
    });

    it("handles one-to-many relationships", () => {
      const tables = [
        createTable("source", "source"),
        createTable("derived_a", "derived"),
        createTable("derived_b", "derived"),
      ];
      const lineage = [
        createRelation("source", "derived_a"),
        createRelation("source", "derived_b"),
      ];

      const result = buildReactFlowGraph(lineage, tables);

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
    });

    it("deduplicates edges", () => {
      const tables = [
        createTable("source", "source"),
        createTable("derived", "derived"),
      ];
      // Duplicate relation
      const lineage = [
        createRelation("source", "derived"),
        createRelation("source", "derived"),
      ];

      const result = buildReactFlowGraph(lineage, tables);

      expect(result.edges).toHaveLength(1);
    });

    it("positions source nodes on left, derived on right", () => {
      const tables = [
        createTable("source", "source"),
        createTable("derived", "derived"),
      ];
      const lineage = [createRelation("source", "derived")];

      const result = buildReactFlowGraph(lineage, tables);

      const sourceNode = result.nodes.find((n) => n.id === "source");
      const derivedNode = result.nodes.find((n) => n.id === "derived");

      expect(sourceNode?.position.x).toBe(0);
      expect(derivedNode!.position.x).toBeGreaterThan(sourceNode!.position.x);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // getUpstreamTables
  // ─────────────────────────────────────────────────────────────────────────────

  describe("getUpstreamTables", () => {
    it("returns empty set for table with no parents", () => {
      const lineage = [createRelation("source", "derived")];
      const result = getUpstreamTables("source", lineage);

      expect(result.size).toBe(0);
    });

    it("returns direct parent tables", () => {
      const lineage = [createRelation("source", "derived")];
      const result = getUpstreamTables("derived", lineage);

      expect(result.size).toBe(1);
      expect(result.has("source")).toBe(true);
    });

    it("returns all upstream tables in chain", () => {
      // A -> B -> C
      const lineage = [
        createRelation("A", "B"),
        createRelation("B", "C"),
      ];
      const result = getUpstreamTables("C", lineage);

      expect(result.size).toBe(2);
      expect(result.has("A")).toBe(true);
      expect(result.has("B")).toBe(true);
    });

    it("handles multiple parents (many-to-one)", () => {
      // A -> C
      // B -> C
      const lineage = [
        createRelation("A", "C"),
        createRelation("B", "C"),
      ];
      const result = getUpstreamTables("C", lineage);

      expect(result.size).toBe(2);
      expect(result.has("A")).toBe(true);
      expect(result.has("B")).toBe(true);
    });

    it("handles diamond dependency pattern", () => {
      // A -> B -> D
      // A -> C -> D
      const lineage = [
        createRelation("A", "B"),
        createRelation("A", "C"),
        createRelation("B", "D"),
        createRelation("C", "D"),
      ];
      const result = getUpstreamTables("D", lineage);

      expect(result.size).toBe(3);
      expect(result.has("A")).toBe(true);
      expect(result.has("B")).toBe(true);
      expect(result.has("C")).toBe(true);
    });

    it("returns empty set for unknown table", () => {
      const lineage = [createRelation("A", "B")];
      const result = getUpstreamTables("unknown", lineage);

      expect(result.size).toBe(0);
    });
  });
});

