import { useProcessFlow } from '@/context';
import { Modal } from 'antd';

interface ClearAllModalProps {
  isModalOpen: boolean;
  showModal: () => void;
  setIsModalOpen: (value: boolean) => void;
}

export const ClearAllModal = ({
  isModalOpen,
  setIsModalOpen,
}: ClearAllModalProps) => {
  const { clearActivities } = useProcessFlow();

  const handleOk = () => {
    clearActivities();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Clear All Activities"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes, clear all"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to clear all activities?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};
