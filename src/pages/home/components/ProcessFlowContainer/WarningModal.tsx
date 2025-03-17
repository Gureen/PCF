import { enLanguage } from '@/language/english';
import { WarningOutlined } from '@ant-design/icons';
import { Alert, Modal, Space, Typography } from 'antd';
import './styles.css';

const { Text } = Typography;

/**
 * Props for the WarningModal component
 */
interface WarningModalProps {
  /** Whether the confirmation modal is currently visible */
  isConfirmModalOpen: boolean;
  /** ID of the flow waiting to be loaded */
  pendingLoadId: string | null;
  /** Name of the current flow that has unsaved changes */
  currentFlowName: string;
  /** Function to proceed with loading the pending flow */
  proceedWithLoad: (id: string) => void;
  /** Function to set the modal's visibility state */
  setIsConfirmModalOpen: (isOpen: boolean) => void;
  /** Function to cancel the load operation */
  cancelLoad: () => void;
  /** Function to get a flow name by its ID */
  getFlowNameById: (id: string) => string;
}

/**
 * Modal component that warns about unsaved changes when loading a flow
 * Asks for confirmation before discarding changes and loading a new flow
 * @param cancelLoad Function to cancel the load operation
 * @param currentFlowName Name of the current flow that has unsaved changes
 * @param getFlowNameById Function to get a flow name by its ID
 * @param isConfirmModalOpen Whether the confirmation modal is currently visible
 * @param pendingLoadId ID of the flow waiting to be loaded
 * @param proceedWithLoad Function to proceed with loading the pending flow
 * @param setIsConfirmModalOpen Function to set the modal's visibility state
 * @returns React component for the warning modal
 */
export const WarningModal = ({
  cancelLoad,
  currentFlowName,
  getFlowNameById,
  isConfirmModalOpen,
  pendingLoadId,
  proceedWithLoad,
  setIsConfirmModalOpen,
}: WarningModalProps) => {
  /**
   * Gets the name of the flow being loaded
   * Uses the flow ID to look up the name or falls back to "another flow"
   */
  const targetFlowName = pendingLoadId
    ? getFlowNameById(pendingLoadId)
    : 'another flow';

  return (
    <Modal
      open={isConfirmModalOpen}
      onOk={() => {
        if (pendingLoadId) {
          proceedWithLoad(pendingLoadId);
        }
        setIsConfirmModalOpen(false);
      }}
      onCancel={cancelLoad}
      okText={enLanguage.PROCESS_FLOW.WARNING_MODAL.CONFIRM}
      cancelText={enLanguage.PROCESS_FLOW.WARNING_MODAL.CANCEL}
      okButtonProps={{
        danger: true,
        icon: <WarningOutlined />,
      }}
      width={450}
      centered
      closable={false}
      maskClosable={false}
    >
      <Space direction="vertical" className="modal-content">
        <Alert
          message={enLanguage.PROCESS_FLOW.WARNING_MODAL.ALERT_TITLE}
          description={
            <Space direction="vertical">
              <Text>
                {enLanguage.PROCESS_FLOW.WARNING_MODAL.DESCRIPTION_1}
                <Text strong className="flow-name">
                  "{currentFlowName}"
                </Text>
                {enLanguage.PROCESS_FLOW.WARNING_MODAL.DESCRIPTION_2}
                <Text strong className="flow-name">
                  {pendingLoadId
                    ? `"${targetFlowName}"`
                    : enLanguage.PROCESS_FLOW.WARNING_MODAL.ANOTHER_FLOW}
                </Text>
                {enLanguage.PROCESS_FLOW.WARNING_MODAL.DESCRIPTION_3}
              </Text>
            </Space>
          }
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          className="warning-alert"
        />
      </Space>
    </Modal>
  );
};
