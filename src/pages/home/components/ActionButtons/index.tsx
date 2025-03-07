import { useProcessFlow } from '@/context';
import { Button, type FormInstance } from 'antd';
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

  const { activities, saveFlow, currentFlowId } = useProcessFlow();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClearClick = () => {
    showModal();
  };

  const handleSaveClick = () => {
    const projectFlowName = form.getFieldValue('projectFlowName');
    saveFlow(projectFlowName);
  };

  const isButtonDisabled = !activities || activities.length === 0;

  // Determine if we're updating an existing flow or creating a new one
  const isSavingExistingFlow = !!currentFlowId;

  return (
    <div className="action-buttons">
      <Button
        type="primary"
        onClick={handleSaveClick}
        disabled={isButtonDisabled}
      >
        {isSavingExistingFlow ? ActionButtonsText.UPDATE_BUTTON : ActionButtonsText.SAVE_BUTTON}
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