import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Tooltip } from 'antd';
import { useState } from 'react';
import type { PositionLoggerNodeData } from './types';
import './styles.css';
import { ToolTipContent } from './ToolTipContent';

export function PositionLoggerNode({
  data,
  selected,
}: NodeProps<PositionLoggerNodeData>) {
  const [hovered, setHovered] = useState(false);

  const hasDescription = Boolean(data.description);
  const hasAssignedUsers = Boolean(data.assignedUsers?.length);
  const hasInputs = Boolean(data.inputs?.length);
  const hasOutputs = Boolean(data.outputs?.length);
  const hasDeadline = Boolean(data.deadline);
  const hasApprovalCriteria = Boolean(data.approvalCriteria);

  // Very visible handle styles
  const handleStyle = {
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)', // Add shadow for depth
  };

  // Position adjustments to make handles stand out from the node
  const topHandleStyle = {
    ...handleStyle,
    top: '-12px',
  };

  const bottomHandleStyle = {
    ...handleStyle,
    bottom: '-12px',
  };

  return (
    <Tooltip
      title={
        <ToolTipContent
          data={data}
          hasApprovalCriteria={hasApprovalCriteria}
          hasAssignedUsers={hasAssignedUsers}
          hasDeadline={hasDeadline}
          hasDescription={hasDescription}
          hasInputs={hasInputs}
          hasOutputs={hasOutputs}
        />
      }
      open={hovered}
      placement="right"
      color="#fff"
    >
      <div
        className={`activity-node ${selected ? 'selected' : ''}`}
        style={{
          backgroundColor: data.color,
          position: 'relative',
          marginTop: '15px',
          marginBottom: '15px',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="node-label">{data.label}</div>
        <Handle
          type="target"
          position={Position.Top}
          style={topHandleStyle}
          id="target-top"
          isConnectable={true}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={bottomHandleStyle}
          id="source-bottom"
          isConnectable={true}
        />
      </div>
    </Tooltip>
  );
}
