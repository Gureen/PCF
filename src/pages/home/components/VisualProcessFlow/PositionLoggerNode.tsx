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
    <div
      className="node-tooltip-content"
      style={{ padding: '8px', maxWidth: '320px' }}
    >
      {hasDescription && (
        <div
          className="tooltip-description"
          style={{
            backgroundColor: '#f0f7ff',
            padding: '8px',
            borderRadius: '4px',
            borderLeft: '3px solid #1677ff',
          }}
        >
          <strong>Description:</strong> {data.description}
        </div>
      )}

      {hasAssignedUsers && (
        <div className="tooltip-section" style={{ marginTop: '10px' }}>
          <strong style={{ color: '#722ed1' }}>Assigned to:</strong>
          <div
            className="tooltip-users"
            style={{
              backgroundColor: '#f9f0ff',
              padding: '6px',
              borderRadius: '4px',
              borderLeft: '3px solid #722ed1',
              marginTop: '4px',
            }}
          >
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
        <div className="tooltip-section" style={{ marginTop: '10px' }}>
          <strong style={{ color: '#1890ff' }}>Inputs:</strong>
          <div
            className="tooltip-tags"
            style={{
              backgroundColor: '#e6f7ff',
              padding: '6px',
              borderRadius: '4px',
              borderLeft: '3px solid #1890ff',
              marginTop: '4px',
            }}
          >
            {data?.inputs?.map((input) => (
              <span
                key={`input-${input}`}
                className="tooltip-tag input-tag"
                style={{
                  backgroundColor: '#d6eaff',
                  border: '1px solid #91d5ff',
                }}
              >
                {input}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasOutputs && (
        <div className="tooltip-section" style={{ marginTop: '10px' }}>
          <strong style={{ color: '#52c41a' }}>Outputs:</strong>
          <div
            className="tooltip-tags"
            style={{
              backgroundColor: '#f6ffed',
              padding: '6px',
              borderRadius: '4px',
              borderLeft: '3px solid #52c41a',
              marginTop: '4px',
            }}
          >
            {data?.outputs?.map((output) => (
              <span
                key={`output-${output}`}
                className="tooltip-tag output-tag"
                style={{
                  backgroundColor: '#d9f7be',
                  border: '1px solid #b7eb8f',
                }}
              >
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
      open={hovered}
      placement="right"
      color="white"
      overlayInnerStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        className={`activity-node ${selected ? 'selected' : ''}`}
        style={{ borderLeft: `4px solid ${data.color || '#1677ff'}` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="activity-node-header"
          style={{ color: data.color || '#1677ff', fontWeight: 600 }}
        >
          {data.label}
        </div>

        {hasAssignedUsers && (
          <div className="activity-node-users">
            <Avatar.Group size="small" maxCount={3}>
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

        <Handle
          type="target"
          position={Position.Top}
          style={{ background: data.color || '#1677ff', width: 8, height: 8 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: data.color || '#1677ff', width: 8, height: 8 }}
        />
      </div>
    </Tooltip>
  );
}
