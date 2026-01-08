import type { ReactNode } from "react";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Database, GitBranch } from "lucide-react";
import type { LineageNodeData } from "@/utils/lineageUtils";
import styles from "./DataLineage.module.scss";

interface LineageNodeComponentProps extends NodeProps {
  data: LineageNodeData;
}

function LineageNodeComponent({
  data,
  selected,
}: LineageNodeComponentProps): ReactNode {
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
      <div className={styles.flowNodeContent}>
        <span className={styles.flowNodeName}>{data.displayName}</span>
        <code className={styles.flowNodeCode}>{data.tableName}</code>
      </div>

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

export const LineageNodeMemo = memo(LineageNodeComponent);
