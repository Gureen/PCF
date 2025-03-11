import { Button, type FormInstance, message } from 'antd';
import { useState } from 'react';
import { ClearAllModal } from '../ClearAllModal';
import { ActionButtonsText } from './constants';
import './styles.css';
import { useProcessFlow } from '@/context/hooks';
import { ClearOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { ProcessFlowFormText } from '../ProcessFlowForm/constants';
import type { FormValues } from '../ProcessFlowForm/types';

interface ActionButtonsProps {
  form: FormInstance<FormValues>;
}

export const ActionButtons = ({ form }: ActionButtonsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    activities,
    saveFlow,
    currentFlowId,
    hasChanges,
    isEditing,
    clearActivities,
    setCurrentFlowName,
    setCurrentFlowId,
  } = useProcessFlow();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClearClick = () => {
    if (activities && activities.length > 0 && hasChanges) {
      showModal();
    } else if (activities && activities.length > 0) {
      clearActivities();
    }
  };

  const handleNewClick = () => {
    createNewFlow();
  };

  const createNewFlow = () => {
    form.resetFields();
    clearActivities();
    setCurrentFlowName('');
    setCurrentFlowId(null);
    messageApi.success({
      content: 'Started new process flow',
      duration: 3,
    });
  };

  const handleSaveClick = () => {
    const projectFlowName = form.getFieldValue('projectFlowName');

    if (!projectFlowName || projectFlowName.trim() === '') {
      messageApi.warning({
        content: 'Project flow name is required to save the process.',
        duration: 4,
      });
      return;
    }

    if (!activities || activities.length === 0) {
      messageApi.warning({
        content: 'At least one activity is needed to save the process.',
        duration: 4,
      });
      return;
    }

    const result = saveFlow(projectFlowName);

    if (result.isNew) {
      messageApi.success({
        content: 'The process has been created.',
      });
    } else if (result.isUpdated) {
      messageApi.info({
        content: 'The process has been updated.',
      });
    }
  };

  const isButtonDisabled = !activities || activities.length === 0;
  const isSaveButtonDisabled = !!currentFlowId && !hasChanges;
  const renderButtonText = isEditing
    ? ProcessFlowFormText.ACTIVITIES.BUTTON.UPDATE
    : ProcessFlowFormText.ACTIVITIES.BUTTON.ADD_ACITIVTY;

  return (
    <div className="action-buttons">
      {contextHolder}
      <Button type="primary" onClick={handleNewClick}>
        <PlusOutlined style={{ fontSize: '18px' }} />
        {ActionButtonsText.NEW_BUTTON}
      </Button>
      <Button
        onClick={handleSaveClick}
        disabled={isSaveButtonDisabled}
        color="green"
        variant="solid"
      >
        <SaveOutlined style={{ fontSize: '18px' }} />
        {renderButtonText}
      </Button>
      <Button danger onClick={handleClearClick} disabled={isButtonDisabled}>
        <ClearOutlined style={{ fontSize: '18px' }} />
        {ActionButtonsText.CLEAR_BUTTON}
      </Button>
      <ClearAllModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};
