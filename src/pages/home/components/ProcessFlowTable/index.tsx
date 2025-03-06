import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { PROCESS_FLOW_TEXT } from './constants';
import { preloadedFlows } from './mocks';
import type { SavedFlowType } from './types';
import './styles.css';

export const ProcesFlowTable = () => {
  const [savedFlows, _] = useState<SavedFlowType[]>(preloadedFlows);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<SavedFlowType[]>(savedFlows);

  const filterFlows = (flows: SavedFlowType[], query: string) => {
    return flows.filter((flow) =>
      flow.projectName.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const updateFilteredFlows = (flows: SavedFlowType[], query: string) => {
    const filtered = filterFlows(flows, query);
    setFilteredData(filtered);
  };

  const paginationConfig = {
    pageSize: 3,
    showSizeChanger: false,
    showTotal: PROCESS_FLOW_TEXT.PAGINATION_TOTAL,
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateFilteredFlows(savedFlows, searchText);
  }, [searchText, savedFlows]);

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

        <Table<SavedFlowType>
          dataSource={filteredData}
          pagination={paginationConfig}
          className="dark-header-table"
          size="small"
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
            render={(_, __) => (
              <Space size="small">
                <Tooltip title={PROCESS_FLOW_TEXT.ACTION.LOAD}>
                  <Button type="text" icon={<EditOutlined />} />
                </Tooltip>
                <Tooltip title={PROCESS_FLOW_TEXT.ACTION.EXPORT}>
                  <Button type="text" icon={<ExportOutlined />} />
                </Tooltip>
                <Tooltip title={PROCESS_FLOW_TEXT.ACTION.DELETE}>
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      </Space>
    </>
  );
};
