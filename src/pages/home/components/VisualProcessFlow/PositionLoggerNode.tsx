import React, { useState } from 'react';
import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Tooltip, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { PositionLoggerNodeData } from './types';

export function PositionLoggerNode({
  data,
  selected,
}: NodeProps<PositionLoggerNodeData>) {
  const [hovered, setHovered] = useState(false);
  
  // Prepare tooltip content
  const tooltipContent = (
    <div className="node-tooltip-content">
      {data.description && (
        <div className="tooltip-description">
          <strong>Description:</strong> {data.description}
        </div>
      )}
      
      {data.assignedUsers && data.assignedUsers.length > 0 && (
        <div className="tooltip-section">
          <strong>Assigned to:</strong>
          <div className="tooltip-users">
            {data.assignedUsers.map((user, index) => (
              <span key={index} className="tooltip-tag user-tag">
                <UserOutlined style={{ marginRight: 4 }} />
                {user}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data.inputs && data.inputs.length > 0 && (
        <div className="tooltip-section">
          <strong>Inputs:</strong>
          <div className="tooltip-tags">
            {data.inputs.map((input, index) => (
              <span key={index} className="tooltip-tag input-tag">{input}</span>
            ))}
          </div>
        </div>
      )}
      
      {data.outputs && data.outputs.length > 0 && (
        <div className="tooltip-section">
          <strong>Outputs:</strong>
          <div className="tooltip-tags">
            {data.outputs.map((output, index) => (
              <span key={index} className="tooltip-tag output-tag">{output}</span>
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
        {/* Header section with the activity name */}
        {data.label && (
          <div className="activity-node-header" style={{ color: data.color }}>
            {data.label}
          </div>
        )}
        
        
        {/* Show assigned users avatars if available */}
        {data.assignedUsers && data.assignedUsers.length > 0 && (
          <div className="activity-node-users">
            <Avatar.Group 
              maxCount={2} 
              size="small"
              maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            >
              {data.assignedUsers.map((user, index) => (
                <Avatar key={index} size="small" icon={<UserOutlined />} />
              ))}
            </Avatar.Group>
          </div>
        )}

        {/* Connection handles */}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
}