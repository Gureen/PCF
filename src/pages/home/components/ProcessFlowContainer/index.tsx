import { useProcessFlow } from '@/context/hooks';
import type { SavedFlow } from '@/interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { ImportModal } from './ImportModal';
import { ProcessFlowTable } from './ProcessFlowTable';
import { WarningModal } from './WarningModal';
import { PROCESS_FLOW_TEXT, paginationConfig } from './constants';
import './styles.css';
import {
  exportFlow,
  filterFlows,
  getFlowNameById,
  showErrorMessage,
  showInfoMessage,
  showSuccessMessage,
} from './utils';

export const ProcessFlowContainer = () => {
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

  const combinedFlows = [...preloadedFlowsData, ...savedFlows];

  const updateFilteredFlows = (flows: SavedFlow[], query: string) => {
    const filtered = filterFlows(flows, query);
    setFilteredData(filtered);
  };

  const handleLoadFlow = (flowId: string) => {
    if (hasChanges) {
      setPendingLoadId(flowId);
      setIsConfirmModalOpen(true);
      return;
    }

    proceedWithLoad(flowId);
  };

  const proceedWithLoad = (flowId: string) => {
    loadFlow(flowId);
    showInfoMessage(messageApi, 'The flow process has been loaded.');
    setPendingLoadId(null);
  };

  const cancelLoad = () => {
    setPendingLoadId(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteFlow = (record: SavedFlow) => {
    const success = deleteFlow(record.id);
    if (success) {
      showSuccessMessage(messageApi, 'The process has been deleted.');
    }
  };

  const handleExportFlow = (record: SavedFlow) => {
    exportFlow(record, messageApi);
  };

  const handleImportConfirm = () => {
    if (!importedFlow) {
      return;
    }

    try {
      const result = importFlow(importedFlow);

      showSuccessMessage(
        messageApi,
        result.isNew
          ? 'Flow imported and saved successfully!'
          : 'Flow imported and updated successfully!',
      );

      setIsImportModalOpen(false);
      setImportedFlow(null);
    } catch (error) {
      showErrorMessage(messageApi, 'Failed to import flow.', error);
    }
  };

  const getFlowName = (flowId: string) =>
    getFlowNameById(combinedFlows, flowId);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {
    updateFilteredFlows(combinedFlows, searchText);
  }, [searchText, savedFlows, preloadedFlowsData]);

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

      <ProcessFlowTable
        data={filteredData}
        paginationConfig={paginationConfig}
        onLoad={handleLoadFlow}
        onExport={handleExportFlow}
        onDelete={handleDeleteFlow}
        onSearchChange={handleSearchChange}
        setImportedFlow={setImportedFlow}
        setIsImportModalOpen={setIsImportModalOpen}
      />

      <WarningModal
        cancelLoad={cancelLoad}
        currentFlowName={currentFlowName}
        getFlowNameById={getFlowName}
        isConfirmModalOpen={isConfirmModalOpen}
        pendingLoadId={pendingLoadId}
        proceedWithLoad={proceedWithLoad}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
      />

      <ImportModal
        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        importedFlow={importedFlow}
        setImportedFlow={setImportedFlow}
        hasChanges={hasChanges}
        handleImportConfirm={handleImportConfirm}
      />
    </>
  );
};
