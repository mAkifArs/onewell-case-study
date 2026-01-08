import type { ReactNode, MouseEvent } from "react";
import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type NodeTypes,
  type NodeMouseHandler,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { LineageRelation, ProjectTable } from "@/types";
import {
  buildReactFlowGraph,
  type LineageNodeData,
} from "@/utils/lineageUtils";
import { getUpstreamTables } from "@/utils/lineageUtils";
import { LineageNodeMemo } from "./LineageNode";
import styles from "./DataLineage.module.scss";

interface LineageFlowProps {
  lineage: LineageRelation[];
  tables: ProjectTable[];
}

const nodeTypes: NodeTypes = {
  lineageNode: LineageNodeMemo,
};

export function LineageFlow({ lineage, tables }: LineageFlowProps): ReactNode {
  // Build initial graph
  const initialGraph = useMemo(
    () => buildReactFlowGraph(lineage, tables),
    [lineage, tables]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  // Handle node click - highlight upstream dependencies
  const onNodeClick: NodeMouseHandler<Node<LineageNodeData>> = useCallback(
    (_event: MouseEvent, node: Node<LineageNodeData>) => {
      const upstream = getUpstreamTables(node.id, lineage);
      const highlightedIds = new Set([node.id, ...upstream]);

      // Update nodes - mark selected
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: highlightedIds.has(n.id),
        }))
      );

      // Update edges - highlight connected edges
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated:
            highlightedIds.has(e.source) && highlightedIds.has(e.target),
          style: {
            ...e.style,
            stroke:
              highlightedIds.has(e.source) && highlightedIds.has(e.target)
                ? "#1e3a5f"
                : undefined,
            strokeWidth:
              highlightedIds.has(e.source) && highlightedIds.has(e.target)
                ? 2
                : 1,
          },
        }))
      );
    },
    [lineage, setNodes, setEdges]
  );

  // Handle pane click - clear selection
  const onPaneClick = useCallback(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: false,
      }))
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: false,
        style: { ...e.style, stroke: undefined, strokeWidth: 1 },
      }))
    );
  }, [setNodes, setEdges]);

  // Calculate height based on number of nodes
  const sourceCount = initialGraph.nodes.filter(
    (n) => n.data.tableType === "source"
  ).length;
  const derivedCount = initialGraph.nodes.filter(
    (n) => n.data.tableType === "derived"
  ).length;
  const maxNodes = Math.max(sourceCount, derivedCount);
  const dynamicHeight = Math.max(240, maxNodes * 70 + 40);

  return (
    <div className={styles.flowContainer} style={{ height: dynamicHeight }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, includeHiddenNodes: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        preventScrolling={false}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="var(--color-border-light)" />
      </ReactFlow>
    </div>
  );
}
