import type { SavedFlow } from '@/interfaces';
import { enLanguage } from '@/language/english';
import {
  CalendarOutlined,
  ClockCircleOutlined,
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
import { createFileUploadProps } from './utils';

/**
 * Props for the ProcessFlowTable component
 */
interface ProcessFlowTableProps {
  /** Array of flow data to display in the table */
  data: SavedFlow[];
  /** Configuration for table pagination */
  paginationConfig: TablePaginationConfig;
  /** Function to handle loading a flow */
  onLoad: (id: string) => void;
  /** Function to handle exporting a flow */
  onExport: (record: SavedFlow) => void;
  /** Function to handle deleting a flow */
  onDelete: (record: SavedFlow) => void;
  /** Function to handle search input changes */
  onSearchChange: (value: string) => void;
  /** Function to set the imported flow data */
  setImportedFlow: (flow: SavedFlow | null) => void;
  /** Function to control the import modal visibility */
  setIsImportModalOpen: (isOpen: boolean) => void;
}

/**
 * Table component for displaying and managing process flows
 * Provides search, import, and per-flow actions (load, export, delete)
 * @param data Array of flow data to display in the table
 * @param paginationConfig Configuration for table pagination
 * @param onLoad Function to handle loading a flow
 * @param onExport Function to handle exporting a flow
 * @param onDelete Function to handle deleting a flow
 * @param onSearchChange Function to handle search input changes
 * @param setImportedFlow Function to set the imported flow data
 * @param setIsImportModalOpen Function to control the import modal visibility
 * @returns React component for the process flow table
 */
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
  /**
   * Create upload props for the import button
   * Configures file validation and handling
   */
  const uploadProps = createFileUploadProps(
    setImportedFlow,
    setIsImportModalOpen,
  );

  return (
    <Space direction="vertical" className="full-width">
      <Space className="table-controls">
        <Input
          prefix={<SearchOutlined />}
          placeholder={enLanguage.PROCESS_FLOW.SEARCH_PLACEHOLDER}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />
        <Upload {...uploadProps}>
          <Button type="primary" icon={<ImportOutlined />}>
            {enLanguage.PROCESS_FLOW.ACTION.IMPORT}
          </Button>
        </Upload>
      </Space>
      <Table
        className="modern-table"
        dataSource={data}
        pagination={{
          ...paginationConfig,
          showTotal: (total) => enLanguage.PROCESS_FLOW.PAGINATION_TOTAL(total),
        }}
        rowKey={(record) => record.id}
      >
        <Table.Column
          title={enLanguage.PROCESS_FLOW.COLUMN.PROJECT_NAME}
          dataIndex="projectName"
          key="projectName"
          sorter={(a, b) => a.projectName.localeCompare(b.projectName)}
        />

        <Table.Column
          title={enLanguage.PROCESS_FLOW.COLUMN.CREATED}
          dataIndex="createdAt"
          key="createdAt"
          width="20%"
          render={(text) => (
            <Space>
              <CalendarOutlined className="icon-neutral" />
              <span>{text}</span>
            </Space>
          )}
        />

        <Table.Column
          title={enLanguage.PROCESS_FLOW.COLUMN.LAST_MODIFIED}
          dataIndex="lastModified"
          key="lastModified"
          render={(text) => (
            <Space>
              <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
              <span>{text}</span>
            </Space>
          )}
        />
        <Table.Column
          title={enLanguage.PROCESS_FLOW.COLUMN.ACTIONS}
          key="actions"
          align="center"
          render={(_, record: SavedFlow) => {
            return (
              <Space size="small">
                <Tooltip title={enLanguage.PROCESS_FLOW.ACTION.LOAD}>
                  <Button
                    type="text"
                    icon={<EditOutlined className="icon-primary" />}
                    onClick={() => onLoad(record.id)}
                  />
                </Tooltip>
                <Tooltip title={enLanguage.PROCESS_FLOW.ACTION.EXPORT}>
                  <Button
                    type="text"
                    icon={<ExportOutlined className="icon-primary" />}
                    onClick={() => onExport(record)}
                  />
                </Tooltip>
                <Tooltip title={enLanguage.PROCESS_FLOW.ACTION.DELETE}>
                  <Popconfirm
                    title={enLanguage.PROCESS_FLOW.DELETE_CONFIRM.TITLE}
                    description={
                      enLanguage.PROCESS_FLOW.DELETE_CONFIRM.DESCRIPTION
                    }
                    onConfirm={() => onDelete(record)}
                    okText={enLanguage.PROCESS_FLOW.DELETE_CONFIRM.OK}
                    cancelText={enLanguage.PROCESS_FLOW.DELETE_CONFIRM.CANCEL}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined className="icon-danger" />}
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
