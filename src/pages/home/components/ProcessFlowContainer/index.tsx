import { useProcessFlow } from '@/context/hooks';
import type { SavedFlow } from '@/interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { ProcessFlowTable } from './ProcessFlowTable';
import { WarningModal } from './WarningModal';
import './styles.css';
import { enLanguage } from '@/language/english';
import { ImportModal } from './ImportModal';
import { paginationConfig } from './constants';
import {
  exportFlow,
  filterFlows,
  getFlowNameById,
  showErrorMessage,
  showInfoMessage,
  showSuccessMessage,
} from './utils';

/**
 * Container component for the Process Flow management section
 * Orchestrates flow table, import/export, and handles flow loading, deletion, and filtering
 * @returns React component for the process flow management interface
 */
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

  const [loadModal, setLoadModal] = useState({
    isOpen: false,
    pendingId: null as string | null,
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedFlow, setImportedFlow] = useState<SavedFlow | null>(null);

  const combinedFlows = [...preloadedFlowsData, ...savedFlows];

  /**
   * Handles the request to load a flow, showing confirmation if there are unsaved changes
   * @param flowId ID of the flow to load
   */
  const handleLoadFlow = (flowId: string) => {
    if (hasChanges) {
      setLoadModal({ isOpen: true, pendingId: flowId });
      return;
    }
    proceedWithLoad(flowId);
  };

  /**
   * Proceeds with loading the flow after confirmation
   * @param flowId ID of the flow to load
   */
  const proceedWithLoad = (flowId: string) => {
    loadFlow(flowId);
    showInfoMessage(messageApi, 'The flow process has been loaded.');
    setLoadModal({ isOpen: false, pendingId: null });
  };

  /**
   * Cancels the load operation
   */
  const cancelLoad = () => {
    setLoadModal({ isOpen: false, pendingId: null });
  };

  /**
   * Handles the deletion of a flow
   * @param record Flow data to delete
   */
  const handleDeleteFlow = (record: SavedFlow) => {
    const success = deleteFlow(record.id);
    if (success) {
      showSuccessMessage(messageApi, 'The process has been deleted.');
    }
  };

  /**
   * Handles exporting a flow to a JSON file
   * @param record Flow data to export
   */
  const handleExportFlow = (record: SavedFlow) => {
    exportFlow(record, messageApi);
  };

  /**
   * Handles confirmation of flow import
   * Imports the flow data and shows appropriate messages
   */
  const handleImportConfirm = () => {
    if (!importedFlow) {
      return;
    }

    try {
      const result = importFlow(importedFlow);
      const message = result.isNew
        ? 'Flow imported and saved successfully!'
        : 'Flow imported and updated successfully!';

      showSuccessMessage(messageApi, message);
      setIsImportModalOpen(false);
      setImportedFlow(null);
    } catch (error) {
      showErrorMessage(messageApi, 'Failed to import flow.', error);
    }
  };

  /**
   * Gets a flow name by its ID
   * @param flowId ID of the flow to look up
   * @returns The name of the flow
   */
  const getFlowName = (flowId: string) =>
    getFlowNameById(combinedFlows, flowId);

  /**
   * Handles changes to the search input
   * @param value Search text
   */
  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  // Filter flows when search text or flow data changes
  useEffect(() => {
    setFilteredData(filterFlows(combinedFlows, searchText));
  }, [searchText, savedFlows, preloadedFlowsData]);

  return (
    <>
      {contextHolder}
      <Divider orientation="left" style={{ borderColor: '#1677ff' }}>
        <span>{enLanguage.PROCESS_FLOW.TITLE}</span>
        <Tooltip title={enLanguage.PROCESS_FLOW.TOOLTIP}>
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
        isConfirmModalOpen={loadModal.isOpen}
        pendingLoadId={loadModal.pendingId}
        proceedWithLoad={proceedWithLoad}
        setIsConfirmModalOpen={(isOpen) =>
          setLoadModal({ ...loadModal, isOpen })
        }
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
