import { enLanguage } from '@/language/english';
import { WarningOutlined } from '@ant-design/icons';
import { Alert, Modal, Space, Typography } from 'antd';
import './styles.css';

const { Text } = Typography;

interface WarningModalProps {
  isConfirmModalOpen: boolean;
  pendingLoadId: string | null;
  currentFlowName: string;
  proceedWithLoad: (id: string) => void;
  setIsConfirmModalOpen: (isOpen: boolean) => void;
  cancelLoad: () => void;
  getFlowNameById: (id: string) => string;
}

export const WarningModal = ({
  cancelLoad,
  currentFlowName,
  getFlowNameById,
  isConfirmModalOpen,
  pendingLoadId,
  proceedWithLoad,
  setIsConfirmModalOpen,
}: WarningModalProps) => {
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
