import { Modal } from 'antd';

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
  return (
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
        {pendingLoadId ? `"${getFlowNameById(pendingLoadId)}"` : 'another flow'}
        , your current changes will be lost.
      </p>
      <p>Do you want to discard your changes and continue?</p>
    </Modal>
  );
};
