import type { SavedFlow } from '@/interfaces';
import { enLanguage } from '@/language/english';
import {
  CheckCircleOutlined,
  FileOutlined,
  ImportOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Alert, Card, Modal, Space, Spin, Tag, Typography } from 'antd';
import './styles.css';

/**
 * Props for the ImportModal component
 */
interface ImportModalProps {
  /** Whether the import modal is currently visible */
  isImportModalOpen: boolean;
  /** Function to set the modal's visibility state */
  setIsImportModalOpen: (value: boolean) => void;
  /** The flow data being imported, null if no flow is selected */
  importedFlow: SavedFlow | null;
  /** Function to set the imported flow data */
  setImportedFlow: (value: SavedFlow | null) => void;
  /** Whether there are unsaved changes in the current flow */
  hasChanges: boolean;
  /** Function to handle confirmation of the import action */
  handleImportConfirm: () => void;
}

/**
 * Modal component for importing process flow data
 * Displays imported flow details and warns about unsaved changes
 * @param handleImportConfirm Function to handle confirmation of the import action
 * @param hasChanges Whether there are unsaved changes in the current flow
 * @param isImportModalOpen Whether the import modal is currently visible
 * @param setIsImportModalOpen Function to set the modal's visibility state
 * @param setImportedFlow Function to set the imported flow data
 * @param importedFlow The flow data being imported, null if no flow is selected
 * @returns React component for the import modal
 */
export const ImportModal = ({
  handleImportConfirm,
  hasChanges,
  isImportModalOpen,
  setIsImportModalOpen,
  setImportedFlow,
  importedFlow,
}: ImportModalProps) => {
  const { PROCESS_FLOW } = enLanguage;
  const { IMPORT_MODAL } = PROCESS_FLOW;

  /**
   * Handles cancellation of the import process
   * Closes the modal and resets the imported flow data
   */
  const handleCancel = () => {
    setIsImportModalOpen(false);
    setImportedFlow(null);
  };

  return (
    <Modal
      open={isImportModalOpen}
      onOk={handleImportConfirm}
      onCancel={handleCancel}
      okText={IMPORT_MODAL.CONFIRM}
      cancelText={IMPORT_MODAL.CANCEL}
      okButtonProps={{
        type: 'primary',
        icon: <ImportOutlined />,
        disabled: !importedFlow,
      }}
      width={450}
      centered
      destroyOnClose={true}
    >
      <Space direction="vertical" className="modal-content">
        <Card>
          {importedFlow ? (
            <Space direction="vertical">
              <Space align="start" className="file-info-container">
                <FileOutlined className="file-icon" />
                <div>
                  <Typography.Text strong className="file-title">
                    {importedFlow.projectName}
                  </Typography.Text>
                  <div className="tag-container">
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      {IMPORT_MODAL.READY_TO_IMPORT}
                    </Tag>
                    {importedFlow.createdAt && (
                      <Typography.Text type="secondary" className="date-info">
                        {IMPORT_MODAL.LAST_MODIFIED}:{' '}
                        {new Date(importedFlow.createdAt).toLocaleDateString()}
                      </Typography.Text>
                    )}
                  </div>
                </div>
              </Space>
            </Space>
          ) : (
            <Space align="center" direction="vertical" className="empty-state">
              <Spin spinning={false} />
              <Typography.Text type="secondary">
                {IMPORT_MODAL.SELECT_FILE}
              </Typography.Text>
            </Space>
          )}
        </Card>

        {hasChanges && (
          <Alert
            message={
              <Typography.Text strong>
                {IMPORT_MODAL.UNSAVED_CHANGES_WARNING}
              </Typography.Text>
            }
            description={IMPORT_MODAL.DISCARD_WARNING}
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        )}
      </Space>
    </Modal>
  );
};
