import type { SavedFlow } from '@/context';
import { useProcessFlow } from '@/context';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  message,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { PROCESS_FLOW_TEXT } from './constants';
import './styles.css';

export const ProcessFlowTable = () => {
  const {
    savedFlows,
    loadFlow,
    deleteFlow,
    preloadedFlowsData,
    hasChanges,
    currentFlowName,
    importFlow,
  } = useProcessFlow();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<SavedFlow[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [pendingLoadId, setPendingLoadId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedFlow, setImportedFlow] = useState<SavedFlow | null>(null);

  // File input ref for manual triggering
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // If there are unsaved changes, show confirmation modal
    if (hasChanges) {
      setPendingLoadId(flowId);
      setIsConfirmModalOpen(true);
      return;
    }

    // Otherwise load directly
    proceedWithLoad(flowId);
  };

  const proceedWithLoad = (flowId: string) => {
    loadFlow(flowId);
    messageApi.info({
      content: 'The flow process has been loaded.',
    });
    setPendingLoadId(null);
  };

  const cancelLoad = () => {
    setPendingLoadId(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteFlow = (record: SavedFlow) => {
    const success = deleteFlow(record.id);
    if (success) {
      messageApi.success({
        content: 'The process has been deleted.',
      });
    }
  };

  // Export flow as JSON file
  const handleExportFlow = (record: SavedFlow) => {
    try {
      // Create a blob with the JSON data
      const flowData = JSON.stringify(record, null, 2);
      const blob = new Blob([flowData], { type: 'application/json' });

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${record.projectName.replace(/\s+/g, '_')}_flow.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      messageApi.success({
        content: 'Flow exported successfully!',
      });
    } catch (error) {
      messageApi.error({
        content: 'Failed to export flow.',
      });
      console.error('Export error:', error);
    }
  };

  // Handle file upload for import
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedFlow = JSON.parse(content) as SavedFlow;

        // Validate the imported JSON structure
        if (!(parsedFlow.projectName && Array.isArray(parsedFlow.activities))) {
          throw new Error('Invalid flow format');
        }

        // Ensure activities have IDs
        const validatedActivities = parsedFlow.activities.map((activity) => {
          if (!activity.id) {
            return {
              ...activity,
              id: crypto.randomUUID(),
            };
          }
          return activity;
        });

        // Create a validated flow object
        const validatedFlow = {
          ...parsedFlow,
          activities: validatedActivities,
          // Use existing ID or create a new one if none exists
          id: parsedFlow.id || crypto.randomUUID(),
          // Ensure createdAt and lastModified exist
          createdAt: parsedFlow.createdAt || new Date().toLocaleDateString(),
          lastModified: new Date().toLocaleDateString(),
        };

        setImportedFlow(validatedFlow);
        setIsImportModalOpen(true);
      } catch (error) {
        messageApi.error({
          content: 'Invalid JSON file format.',
        });
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Import the flow
  const handleImportConfirm = () => {
    if (!importedFlow) {
      return;
    }

    try {
      // Use the context's importFlow function which properly handles state updates
      const result = importFlow(importedFlow);

      messageApi.success({
        content: result.isNew
          ? 'Flow imported and saved successfully!'
          : 'Flow imported and updated successfully!',
      });

      setIsImportModalOpen(false);
      setImportedFlow(null);
    } catch (error) {
      messageApi.error({
        content: 'Failed to import flow.',
      });
      console.error('Import confirmation error:', error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateFilteredFlows(combinedFlows, searchText);
  }, [searchText, savedFlows, preloadedFlowsData]);

  const getFlowNameById = (flowId: string) => {
    const flow = combinedFlows.find((f) => f.id === flowId);
    return flow ? flow.projectName : 'another flow';
  };

  return (
    <>
      {contextHolder}
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
        <Space className="search-and-import">
          <Input
            prefix={<SearchOutlined />}
            placeholder={PROCESS_FLOW_TEXT.SEARCH_PLACEHOLDER}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="search-input"
            style={{ flex: 1 }}
          />

          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Import button */}
          <Tooltip title="Import Flow">
            <Button
              type="primary"
              icon={<ImportOutlined />}
              onClick={() => fileInputRef.current?.click()}
            >
              Import
            </Button>
          </Tooltip>
        </Space>

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
                  <Tooltip title="Export as JSON">
                    <Button
                      type="text"
                      icon={<ExportOutlined />}
                      onClick={() => handleExportFlow(record)}
                    />
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

      {/* Unsaved Changes Confirmation Modal */}
      <Modal
        title="Unsaved Changes"
        open={isConfirmModalOpen}
        onOk={() => {
          if (pendingLoadId) {
            proceedWithLoad(pendingLoadId);
          }
          setIsConfirmModalOpen(false);
        }}
        onCancel={cancelLoad}
        okText="Discard Changes and Load"
        cancelText="Cancel"
      >
        <p>
          You have unsaved changes to "{currentFlowName}". If you load{' '}
          {pendingLoadId
            ? `"${getFlowNameById(pendingLoadId)}"`
            : 'another flow'}
          , your current changes will be lost.
        </p>
        <p>Do you want to discard your changes and continue?</p>
      </Modal>

      <Modal
        title="Import Flow"
        open={isImportModalOpen}
        onOk={handleImportConfirm}
        onCancel={() => {
          setIsImportModalOpen(false);
          setImportedFlow(null);
        }}
        okText="Import"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to import the flow "{importedFlow?.projectName}
          "?
        </p>
        {hasChanges && (
          <p style={{ color: '#ff4d4f' }}>
            Warning: You have unsaved changes that will be lost if you proceed.
          </p>
        )}
      </Modal>
    </>
  );
};
