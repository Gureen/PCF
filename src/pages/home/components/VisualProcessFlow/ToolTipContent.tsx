import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FormOutlined,
  UserOutlined,
} from '@ant-design/icons';

interface TooltipContentProps {
  data: PositionLoggerType;
  hasDescription: boolean;
  hasApprovalCriteria: boolean;
  hasAssignedUsers: boolean;
  hasInputs: boolean;
  hasOutputs: boolean;
  hasDeadline: boolean;
}

interface PositionLoggerType {
  label: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  assignedUsers?: string[];
  color?: string;
  deadline?: string;
  approvalCriteria?: string;
  priority?: string;
}

export const ToolTipContent = ({
  data,
  hasDescription,
  hasApprovalCriteria,
  hasAssignedUsers,
  hasInputs,
  hasOutputs,
  hasDeadline,
}: TooltipContentProps) => {
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

  return (
    <div
      className="node-tooltip-content"
      style={{
        padding: '12px',
        maxWidth: '320px',
        borderRadius: '8px',
        backgroundColor: '#f0f2f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      {hasDescription && (
        <div className="tooltip-section" style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#5B69BC',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FormOutlined style={{ marginRight: 8 }} />
            Description
          </div>
          <div
            className="tooltip-description"
            style={{
              backgroundColor: '#ffffff',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e6e8eb',
              color: '#333',
              fontSize: '13px',
            }}
          >
            {data.description}
          </div>
        </div>
      )}

      {hasAssignedUsers && (
        <div className="tooltip-section" style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#722ed1',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserOutlined style={{ marginRight: 8 }} />
            Assigned to
          </div>
          <div
            className="tooltip-users"
            style={{
              backgroundColor: '#f9f0ff',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e3d0ff',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {data?.assignedUsers?.map((user) => (
              <span
                key={`user-${user}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #d3adf7',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#531dab',
                }}
              >
                <UserOutlined style={{ marginRight: 4 }} />
                {user}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasInputs && (
        <div className="tooltip-section" style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1890ff',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowDownOutlined style={{ marginRight: 8 }} />
            Inputs
          </div>
          <div
            className="tooltip-tags"
            style={{
              backgroundColor: '#e6f7ff',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #bae7ff',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {data?.inputs?.map((input) => (
              <span
                key={`input-${input}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #91d5ff',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#0050b3',
                }}
              >
                {input}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasOutputs && (
        <div className="tooltip-section" style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#52c41a',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowRightOutlined style={{ marginRight: 8 }} />
            Outputs
          </div>
          <div
            className="tooltip-tags"
            style={{
              backgroundColor: '#f6ffed',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d9f7be',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {data?.outputs?.map((output) => (
              <span
                key={`output-${output}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #b7eb8f',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#389e0d',
                }}
              >
                {output}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasDeadline && (
        <div className="tooltip-section" style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fa8c16',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            Deadline
          </div>
          <div
            className="tooltip-deadline"
            style={{
              backgroundColor: '#fff7e6',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ffe7ba',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              color:
                deadlineStatus === 'passed'
                  ? '#f5222d'
                  : deadlineStatus === 'approaching'
                    ? '#fa8c16'
                    : '#595959',
            }}
          >
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            {formatDeadlineDate(data?.deadline)}
            {deadlineStatus === 'passed' && (
              <span
                style={{ color: '#f5222d', marginLeft: 8, fontWeight: 600 }}
              >
                (Overdue)
              </span>
            )}
            {deadlineStatus === 'approaching' && (
              <span
                style={{ color: '#fa8c16', marginLeft: 8, fontWeight: 600 }}
              >
                (Approaching)
              </span>
            )}
          </div>
        </div>
      )}

      {hasApprovalCriteria && (
        <div className="tooltip-section">
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#13c2c2',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CheckCircleOutlined style={{ marginRight: 8 }} />
            Approval Criteria
          </div>
          <div
            className="tooltip-approval"
            style={{
              backgroundColor: '#e6fffb',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #b5f5ec',
              fontSize: '13px',
              color: '#006d75',
            }}
          >
            {data.approvalCriteria}
          </div>
        </div>
      )}
    </div>
  );
};
