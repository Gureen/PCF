import type { SavedFlow } from '@/interfaces';
import { Modal } from 'antd';

interface ImportModalProps {
  isImportModalOpen: boolean;
  setIsImportModalOpen: (value: boolean) => void;
  importedFlow: SavedFlow | null;
  setImportedFlow: (value: SavedFlow | null) => void;
  hasChanges: boolean;
  handleImportConfirm: () => void;
}

export const ImportModal = ({
  handleImportConfirm,
  hasChanges,
  importedFlow,
  isImportModalOpen,
  setImportedFlow,
  setIsImportModalOpen,
}: ImportModalProps) => {
  return (
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
  );
};
