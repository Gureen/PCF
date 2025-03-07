import { useProcessFlow } from '@/context';
import { Button, type FormInstance, message } from 'antd';
import { useState } from 'react';
import { ClearAllModal } from '../ClearAllModal';
import type { FormValues } from '../ProcessFlowForm';
import { ActionButtonsText } from './constants';
import './styles.css';

interface ActionButtonsProps {
  form: FormInstance<FormValues>;
}

export const ActionButtons = ({ form }: ActionButtonsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { activities, saveFlow, currentFlowId, hasChanges } = useProcessFlow();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClearClick = () => {
    showModal();
  };

  const handleSaveClick = () => {
    const projectFlowName = form.getFieldValue('projectFlowName');

    // Check if there are any activities
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

  const isSavingExistingFlow = !!currentFlowId;

  return (
    <div className="action-buttons">
      {contextHolder}
      <Button
        type="primary"
        onClick={handleSaveClick}
        disabled={isSaveButtonDisabled}
      >
        {isSavingExistingFlow
          ? ActionButtonsText.UPDATE_BUTTON
          : ActionButtonsText.SAVE_BUTTON}
      </Button>
      <Button danger onClick={handleClearClick} disabled={isButtonDisabled}>
        {ActionButtonsText.CLEAR_BUTTON}
      </Button>
      <ClearAllModal
        isModalOpen={isModalOpen}
        showModal={showModal}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};
