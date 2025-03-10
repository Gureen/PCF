import { UserOutlined } from '@ant-design/icons';
import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Avatar, Tooltip } from 'antd';
import { useState } from 'react';
import type { PositionLoggerNodeData } from './types';

export function PositionLoggerNode({
  data,
  selected,
}: NodeProps<PositionLoggerNodeData>) {
  const [hovered, setHovered] = useState(false);

  const hasDescription = Boolean(data.description);
  const hasAssignedUsers = Boolean(data.assignedUsers?.length);
  const hasInputs = Boolean(data.inputs?.length);
  const hasOutputs = Boolean(data.outputs?.length);

  const tooltipContent = (
    <div className="node-tooltip-content">
      {hasDescription && (
        <div className="tooltip-description">
          <strong>Description:</strong> {data.description}
        </div>
      )}

      {hasAssignedUsers && (
        <div className="tooltip-section">
          <strong>Assigned to:</strong>
          <div className="tooltip-users">
            {data?.assignedUsers?.map((user) => (
              <span key={`user-${user}`} className="tooltip-tag user-tag">
                <UserOutlined style={{ marginRight: 4 }} />
                {user}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasInputs && (
        <div className="tooltip-section">
          <strong>Inputs:</strong>
          <div className="tooltip-tags">
            {data?.inputs?.map((input) => (
              <span key={`input-${input}`} className="tooltip-tag input-tag">
                {input}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasOutputs && (
        <div className="tooltip-section">
          <strong>Outputs:</strong>
          <div className="tooltip-tags">
            {data?.outputs?.map((output) => (
              <span key={`output-${output}`} className="tooltip-tag output-tag">
                {output}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      visible={hovered}
      placement="right"
      color="white"
      overlayInnerStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        className={`activity-node ${selected ? 'selected' : ''}`}
        style={{ borderColor: data.color }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="activity-node-header" style={{ color: data.color }}>
          {data.label}
        </div>

        {hasAssignedUsers && (
          <div className="activity-node-users">
            <Avatar.Group size="small">
              {data?.assignedUsers?.map((user) => (
                <Avatar
                  key={`avatar-${user}`}
                  size="small"
                  icon={<UserOutlined />}
                />
              ))}
            </Avatar.Group>
          </div>
        )}

        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
}
