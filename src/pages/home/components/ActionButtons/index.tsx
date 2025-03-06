import { Button } from 'antd';
import { useState } from 'react';
import { ClearAllModal } from '../ClearAllModal';
import { ActionButtonsText } from './constants';
import './styles.css';
import { useProcessFlow } from '@/context';

export const ActionButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { activities } = useProcessFlow();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClearClick = () => {
    showModal();
  };

  const isButtonDisabled = !activities || activities.length === 0;

  return (
    <div className="action-buttons">
      <Button type="primary" disabled={isButtonDisabled}>
        {ActionButtonsText.SAVE_BUTTON}
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
