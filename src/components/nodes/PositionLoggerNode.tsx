import { Handle, type NodeProps, Position } from '@xyflow/react';
import type { PositionLoggerNodeData } from '.';

export function PositionLoggerNode({
  data,
}: NodeProps<PositionLoggerNodeData>) {
  return (
    <div className="react-flow__node-default">
      {data.label && <div>{data.label}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
