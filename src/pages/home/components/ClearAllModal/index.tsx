import { useProcessFlow } from '@/context/hooks';
import { Modal } from 'antd';

interface ClearAllModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onConfirm?: () => void;
  modalAction?: 'clear' | 'new';
}

export const ClearAllModal = ({
  isModalOpen,
  setIsModalOpen,
  onConfirm,
  modalAction = 'clear',
}: ClearAllModalProps) => {
  const { clearActivities } = useProcessFlow();

  const handleOk = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      clearActivities();
      setIsModalOpen(false);
    }
  };

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
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Yes"
      cancelText="No"
    >
      <p>{content}</p>
    </Modal>
  );
};
