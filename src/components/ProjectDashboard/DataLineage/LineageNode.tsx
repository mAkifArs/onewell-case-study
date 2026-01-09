import type { ReactNode } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Database, GitBranch } from "lucide-react";
import type { LineageNodeData } from "@/utils/lineageUtils";
import { TableIndicator } from "@/components/TableIndicator";
import styles from "./DataLineage.module.scss";

interface LineageNodeProps extends NodeProps {
  data: LineageNodeData;
}

export function LineageNode({ data, selected }: LineageNodeProps): ReactNode {
  const Icon = data.tableType === "source" ? Database : GitBranch;

  return (
    <div
      className={styles.flowNode}
      data-type={data.tableType}
      data-selected={selected}
    >
      {data.tableType === "derived" && (
        <Handle
          type="target"
          position={Position.Left}
          className={styles.handle}
        />
      )}

      <div className={styles.flowNodeIcon}>
        <Icon size={14} />
      </div>
      <TableIndicator
        displayName={data.displayName}
        tableName={data.tableName}
        variant="stacked"
        size="small"
        truncate
      />

      {data.tableType === "source" && (
        <Handle
          type="source"
          position={Position.Right}
          className={styles.handle}
        />
      )}
      {/* Some derived tables can also be sources for other derived tables */}
      {data.tableType === "derived" && (
        <Handle
          type="source"
          position={Position.Right}
          className={styles.handle}
        />
      )}
    </div>
  );
}
