import type { SavedFlow } from '@/context';
import { useProcessFlow } from '@/context';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { PROCESS_FLOW_TEXT } from './constants';
import './styles.css';

export const ProcessFlowTable = () => {
  const { 
    savedFlows, 
    loadFlow, 
    deleteFlow,
    preloadedFlowsData,
  } = useProcessFlow();
  
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<SavedFlow[]>([]);
  
  // Combine all flows for display
  const combinedFlows = [...preloadedFlowsData, ...savedFlows];

  const filterFlows = (flows: SavedFlow[], query: string) => {
    return flows.filter((flow) =>
      flow.projectName.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const updateFilteredFlows = (flows: SavedFlow[], query: string) => {
    const filtered = filterFlows(flows, query);
    setFilteredData(filtered);
  };

  const paginationConfig = {
    pageSize: 3,
    showSizeChanger: false,
    showTotal: PROCESS_FLOW_TEXT.PAGINATION_TOTAL,
  };
  
  const handleLoadFlow = (flowId: string) => {
    loadFlow(flowId);
  };
  
  const handleDeleteFlow = (record: SavedFlow) => {
    // Delete all types of flows through context
    deleteFlow(record.id);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateFilteredFlows(combinedFlows, searchText);
  }, [searchText, savedFlows, preloadedFlowsData]);

  return (
    <>
      <Divider
        orientation="left"
        className="process-flow-divider"
        style={{ borderColor: '#1677ff' }}
      >
        <span className="process-flow-title">{PROCESS_FLOW_TEXT.TITLE}</span>
        <Tooltip title={PROCESS_FLOW_TEXT.TOOLTIP}>
          <InfoCircleOutlined className="info-icon" />
        </Tooltip>
      </Divider>
      <Space direction="vertical" className="full-width">
        <Input
          prefix={<SearchOutlined />}
          placeholder={PROCESS_FLOW_TEXT.SEARCH_PLACEHOLDER}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="search-input"
        />

        <Table
          dataSource={filteredData}
          pagination={paginationConfig}
          className="dark-header-table"
          size="small"
          rowKey={(record) => record.id}
        >
          <Table.Column
            title={PROCESS_FLOW_TEXT.COLUMN.PROJECT_NAME}
            dataIndex="projectName"
            key="projectName"
            sorter={(a, b) => a.projectName.localeCompare(b.projectName)}
          />

          <Table.Column
            title={PROCESS_FLOW_TEXT.COLUMN.CREATED}
            dataIndex="createdAt"
            key="createdAt"
            width={120}
          />

          <Table.Column
            title={PROCESS_FLOW_TEXT.COLUMN.LAST_MODIFIED}
            dataIndex="lastModified"
            key="lastModified"
            width={120}
          />
          <Table.Column
            title={PROCESS_FLOW_TEXT.COLUMN.ACTIONS}
            key="actions"
            width={150}
            render={(_, record: SavedFlow) => {              
              return (
                <Space size="small">
                  <Tooltip title={PROCESS_FLOW_TEXT.ACTION.LOAD}>
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => handleLoadFlow(record.id)}
                    />
                  </Tooltip>
                  <Tooltip title={PROCESS_FLOW_TEXT.ACTION.EXPORT}>
                    <Button type="text" icon={<ExportOutlined />} />
                  </Tooltip>
                  <Tooltip title={PROCESS_FLOW_TEXT.ACTION.DELETE}>
                    <Popconfirm
                      title="Delete this process flow?"
                      description="Are you sure you want to delete this process flow?"
                      onConfirm={() => handleDeleteFlow(record)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                      />
                    </Popconfirm>
                  </Tooltip>
                </Space>
              );
            }}
          />
        </Table>
      </Space>
    </>
  );
};