import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

interface SavedFlowType {
  key: React.Key;
  projectName: string;
  createdAt: string;
  lastModified: string;
  activityCount: number;
  tags: string[];
}

interface SavedFlowsTableProps {
  onLoad?: (flowId: React.Key) => void;
  onExport?: (flowId: React.Key) => void;
  onDelete?: (flowId: React.Key) => void;
}

export const SavedFlowsTable: React.FC<SavedFlowsTableProps> = ({
  onLoad,
  onExport,
  onDelete,
}) => {
  const [savedFlows, _] = useState<SavedFlowType[]>([
    {
      key: '1',
      projectName: 'Content Approval Process',
      createdAt: '2025-02-15',
      lastModified: '2025-03-01',
      activityCount: 4,
      tags: ['content', 'approval'],
    },
    {
      key: '2',
      projectName: 'Service Request Handling',
      createdAt: '2025-02-20',
      lastModified: '2025-02-28',
      activityCount: 6,
      tags: ['service', 'support'],
    },
    {
      key: '3',
      projectName: 'Purchase Order Approval',
      createdAt: '2025-02-25',
      lastModified: '2025-03-04',
      activityCount: 4,
      tags: ['finance', 'approval'],
    },
    {
      key: '4',
      projectName: 'Employee Onboarding',
      createdAt: '2025-03-01',
      lastModified: '2025-03-05',
      activityCount: 8,
      tags: ['hr', 'onboarding'],
    },
  ]);

  // State for search functionality
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<SavedFlowType[]>(savedFlows);

  // Filter data when search text changes
  useEffect(() => {
    const filtered = savedFlows.filter((flow) =>
      flow.projectName.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchText, savedFlows]);

  return (
    <div className="saved-flows-section">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          marginTop: '8px',
          paddingLeft: '12px',
        }}
      >
        <Divider
          orientation="left"
          style={{ borderColor: '#1677ff', borderWidth: '2px' }}
        >
          <span style={{ fontSize: 18 }}>Saved process flows</span>
          <Tooltip title="Load, edit, or export your previously configured process flows.">
            <InfoCircleOutlined
              style={{
                fontSize: '16px',
                color: '#1890ff',
                marginLeft: '8px',
                position: 'relative',
                top: '1px',
              }}
            />
          </Tooltip>
        </Divider>
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by project name"
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />

        <Table<SavedFlowType>
          dataSource={filteredData}
          pagination={{
            pageSize: 3,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} items`,
          }}
          style={{ marginTop: 8 }}
        >
          <Table.Column
            title="Project Name"
            dataIndex="projectName"
            key="projectName"
            sorter={(a, b) => a.projectName.localeCompare(b.projectName)}
          />

          <Table.Column
            title="Created"
            dataIndex="createdAt"
            key="createdAt"
            width={120}
          />

          <Table.Column
            title="Last Modified"
            dataIndex="lastModified"
            key="lastModified"
            width={120}
          />
          <Table.Column
            title="Actions"
            key="actions"
            width={150}
            render={(_, record) => (
              <Space size="small">
                <Tooltip title="Load">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onLoad?.(record.key)}
                  />
                </Tooltip>
                <Tooltip title="Export as JSON">
                  <Button
                    type="text"
                    icon={<ExportOutlined />}
                    onClick={() => onExport?.(record.key)}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete?.(record.key)}
                  />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      </Space>
    </div>
  );
};
