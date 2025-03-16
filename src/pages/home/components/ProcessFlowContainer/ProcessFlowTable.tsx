import type { SavedFlow } from '@/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  type TablePaginationConfig,
  Tooltip,
  Upload,
} from 'antd';
import { PROCESS_FLOW_TEXT } from '../ProcessFlowContainer/constants';
import { createFileUploadProps } from './utils';

interface ProcessFlowTableProps {
  data: SavedFlow[];
  paginationConfig: TablePaginationConfig;
  onLoad: (id: string) => void;
  onExport: (record: SavedFlow) => void;
  onDelete: (record: SavedFlow) => void;
  onSearchChange: (value: string) => void;
  setImportedFlow: (flow: SavedFlow | null) => void;
  setIsImportModalOpen: (isOpen: boolean) => void;
}

export const ProcessFlowTable = ({
  data,
  paginationConfig,
  onLoad,
  onExport,
  onDelete,
  onSearchChange,
  setImportedFlow,
  setIsImportModalOpen,
}: ProcessFlowTableProps) => {
  const uploadProps = createFileUploadProps(
    setImportedFlow,
    setIsImportModalOpen,
  );

  return (
    <Space direction="vertical" className="full-width">
      <Space className="table-controls">
        <Input
          prefix={<SearchOutlined />}
          placeholder={PROCESS_FLOW_TEXT.SEARCH_PLACEHOLDER}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="search-input"
        />
        <Upload {...uploadProps}>
          <Button type="primary" icon={<ImportOutlined />}>
            {PROCESS_FLOW_TEXT.ACTION.IMPORT}
          </Button>
        </Upload>
      </Space>
      <Table
        dataSource={data}
        pagination={paginationConfig}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
      >
        <Table.Column
          title={PROCESS_FLOW_TEXT.COLUMN.PROJECT_NAME}
          dataIndex="projectName"
          key="projectName"
          sorter={(a, b) => a.projectName.localeCompare(b.projectName)}
          width="40%"
          className="project-name-column"
        />

        <Table.Column
          title={PROCESS_FLOW_TEXT.COLUMN.CREATED}
          dataIndex="createdAt"
          key="createdAt"
          width="20%"
        />

        <Table.Column
          title={PROCESS_FLOW_TEXT.COLUMN.LAST_MODIFIED}
          dataIndex="lastModified"
          key="lastModified"
          width="20%"
        />
        <Table.Column
          title={PROCESS_FLOW_TEXT.COLUMN.ACTIONS}
          key="actions"
          width="20%"
          align="center"
          render={(_, record: SavedFlow) => {
            return (
              <Space size="small">
                <Tooltip title={PROCESS_FLOW_TEXT.ACTION.LOAD}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onLoad(record.id)}
                  />
                </Tooltip>
                <Tooltip title={PROCESS_FLOW_TEXT.ACTION.EXPORT}>
                  <Button
                    type="text"
                    icon={<ExportOutlined />}
                    onClick={() => onExport(record)}
                  />
                </Tooltip>
                <Tooltip title={PROCESS_FLOW_TEXT.ACTION.DELETE}>
                  <Popconfirm
                    title="Delete this process flow?"
                    description="Are you sure you want to delete this process flow?"
                    onConfirm={() => onDelete(record)}
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
  );
};
