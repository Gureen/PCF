import { Handle, type NodeProps, Position } from '@xyflow/react';
import type { PositionLoggerNodeData } from './types';

export function PositionLoggerNode({
  data,
}: NodeProps<PositionLoggerNodeData>) {
  
  return (
    <div className="react-flow__node-default activity-node">
    </div>
  );
}