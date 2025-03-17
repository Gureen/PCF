import { useProcessFlow } from '@/context/hooks';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space, Typography } from 'antd';
import './styles.css';

const { Text, Title } = Typography;

/**
 * Props for the ClearAllModal component
 */
interface ClearAllModalProps {
  /** Whether the modal is currently visible */
  isModalOpen: boolean;
  /** Function to set the modal's visibility state */
  setIsModalOpen: (value: boolean) => void;
  /** Optional callback function called when confirmation is clicked */
  onConfirm?: () => void;
  /** Type of modal action: 'clear' for removing all activities or 'new' for creating a new flow */
  modalAction?: 'clear' | 'new';
}

/**
 * A confirmation modal component used for potentially destructive actions
 * Displays different content based on the modalAction prop ('clear' or 'new')
 * @param isModalOpen Whether the modal is currently visible
 * @param setIsModalOpen Function to set the modal's visibility state
 * @param onConfirm Optional callback function called when confirmation is clicked
 * @param modalAction Type of modal action: 'clear' for removing all activities or 'new' for creating a new flow
 * @returns A modal component with appropriate warning messages and styling
 */
export const ClearAllModal = ({
  isModalOpen,
  setIsModalOpen,
  onConfirm,
  modalAction = 'clear',
}: ClearAllModalProps) => {
  const { clearActivities } = useProcessFlow();

  /**
   * Handles the confirmation action when user clicks 'Yes'
   * Either calls the provided onConfirm callback or clears activities directly
   */
  const handleOk = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      clearActivities();
      setIsModalOpen(false);
    }
  };

  /**
   * Handles the cancel action when user clicks 'No'
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const title =
    modalAction === 'clear'
      ? 'Clear All Confirmation'
      : 'Create New Flow Confirmation';

  const content =
    modalAction === 'clear'
      ? 'Are you sure you want to clear all activities? This action cannot be undone.'
      : 'You have unsaved changes. Creating a new flow will discard these changes. Do you want to continue?';

  return (
    <Modal
      title={
        <Space className="modal-title">
          <ExclamationCircleFilled
            className={
              modalAction === 'clear'
                ? 'warning-icon-red'
                : 'warning-icon-yellow'
            }
          />
          <Title level={5} className="modal-heading">
            {title}
          </Title>
        </Space>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          No
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger={modalAction === 'clear'}
          onClick={handleOk}
          className={
            modalAction === 'clear'
              ? 'confirm-button-danger'
              : 'confirm-button-warning'
          }
        >
          Yes
        </Button>,
      ]}
      className="warning-modal"
      width={420}
      maskClosable={false}
      centered
    >
      <div className="modal-content">
        <Text
          className={
            modalAction === 'clear' ? 'warning-text-red' : 'warning-text-yellow'
          }
        >
          {content}
        </Text>
      </div>
    </Modal>
  );
};
