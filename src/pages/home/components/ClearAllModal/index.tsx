import { useProcessFlow } from '@/context/hooks';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space, Typography } from 'antd';
import './styles.css';

const { Text, Title } = Typography;

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
