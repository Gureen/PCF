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
  isImportModalOpen,
  setIsImportModalOpen,
  setImportedFlow,
  importedFlow,
}: ImportModalProps) => {
  const { PROCESS_FLOW } = enLanguage;
  const { IMPORT_MODAL } = PROCESS_FLOW;

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
