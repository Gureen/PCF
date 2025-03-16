import type { SavedFlow } from '@/interfaces';
import { enLanguage } from '@/language/english';
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
        />

        <Table.Column
          title={enLanguage.PROCESS_FLOW.COLUMN.LAST_MODIFIED}
          dataIndex="lastModified"
          key="lastModified"
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
                    icon={<EditOutlined />}
                    onClick={() => onLoad(record.id)}
                  />
                </Tooltip>
                <Tooltip title={enLanguage.PROCESS_FLOW.ACTION.EXPORT}>
                  <Button
                    type="text"
                    icon={<ExportOutlined />}
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
