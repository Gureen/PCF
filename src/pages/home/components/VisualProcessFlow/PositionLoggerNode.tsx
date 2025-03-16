import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
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
  const hasDeadline = Boolean(data.deadline);
  const hasApprovalCriteria = Boolean(data.approvalCriteria);

  const formatDeadlineDate = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDeadlineStatus = () => {
    if (!data.deadline) {
      return null;
    }

    const deadlineDate = new Date(data.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'passed';
    }
    if (diffDays <= 2) {
      return 'approaching';
    }
    return 'normal';
  };

  const deadlineStatus = getDeadlineStatus();

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

      {hasDeadline && (
        <div className="tooltip-section" style={{ marginTop: '10px' }}>
          <strong style={{ color: '#fa8c16' }}>Deadline:</strong>
          <div
            className="tooltip-deadline"
            style={{
              backgroundColor: '#fff7e6',
              padding: '6px',
              borderRadius: '4px',
              borderLeft: '3px solid #fa8c16',
              marginTop: '4px',
              color:
                deadlineStatus === 'passed'
                  ? '#f5222d'
                  : deadlineStatus === 'approaching'
                    ? '#fa8c16'
                    : '#595959',
            }}
          >
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {formatDeadlineDate(data?.deadline)}
            {deadlineStatus === 'passed' && (
              <span style={{ color: '#f5222d', marginLeft: 6 }}>(Overdue)</span>
            )}
            {deadlineStatus === 'approaching' && (
              <span style={{ color: '#fa8c16', marginLeft: 6 }}>
                (Approaching)
              </span>
            )}
          </div>
        </div>
      )}

      {hasApprovalCriteria && (
        <div className="tooltip-section" style={{ marginTop: '10px' }}>
          <strong style={{ color: '#13c2c2' }}>Approval Criteria:</strong>
          <div
            className="tooltip-approval"
            style={{
              backgroundColor: '#e6fffb',
              padding: '6px',
              borderRadius: '4px',
              borderLeft: '3px solid #13c2c2',
              marginTop: '4px',
            }}
          >
            <CheckCircleOutlined style={{ marginRight: 4 }} />
            {data.approvalCriteria}
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
        style={{ borderLeft: `4px solid ${data.color}` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="activity-node-header"
          style={{ color: data.color, fontWeight: 600 }}
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
          style={{ background: data.color, width: 8, height: 8 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: data.color, width: 8, height: 8 }}
        />
      </div>
    </Tooltip>
  );
}
