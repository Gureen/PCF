import { Button } from 'antd';
import { ActionButtonsText } from './constants';
import './styles.css';

export const ActionButtons = () => {
  return (
    <div className="action-buttons">
      <Button type="primary">{ActionButtonsText.SAVE_BUTTON}</Button>
      <Button danger>{ActionButtonsText.CLEAR_BUTTON}</Button>
    </div>
  );
};
