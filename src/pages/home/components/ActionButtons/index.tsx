import { Button, type FormInstance, message } from 'antd';
import { useState } from 'react';
import { ClearAllModal } from '../ClearAllModal';
import { ActionButtonsText } from './constants';
import './styles.css';
import { useProcessFlow } from '@/context/hooks';
import type { Activity } from '@/interfaces';
import { ClearOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { ProcessFlowFormText } from '../ProcessFlowForm/constants';
import type { FormValues } from '../ProcessFlowForm/types';
import { generateEdgesFromActivities } from '../VisualProcessFlow/utils';

interface ActionButtonsProps {
  form: FormInstance<FormValues>;
}

export const ActionButtons = ({ form }: ActionButtonsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [modalAction, setModalAction] = useState<'clear' | 'new'>('clear');

  const {
    activities,
    saveFlow,
    currentFlowId,
    hasChanges,
    clearActivities,
    setCurrentFlowName,
    setCurrentFlowId,
  } = useProcessFlow();

  const showModal = (action: 'clear' | 'new') => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleClearClick = () => {
    if (activities && activities.length > 0 && hasChanges) {
      showModal('clear');
    } else if (activities && activities.length > 0) {
      clearActivities();
    }
  };

  const handleNewClick = () => {
    if (hasChanges) {
      showModal('new');
    } else {
      createNewFlow();
    }
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

  const handleModalConfirm = () => {
    if (modalAction === 'clear') {
      clearActivities();
    } else if (modalAction === 'new') {
      createNewFlow();
    }
    setIsModalOpen(false);
  };

  const validateAtLeastOneConnection = (activities: Activity[]) => {
    // If there are fewer than 2 activities, we can't validate connections
    if (!activities || activities.length < 2) {
      return false;
    }

    const edges = generateEdgesFromActivities(activities);

    // If no edges were generated, it means no connections exist
    if (edges.length === 0) {
      return false;
    }

    // Collect all unique node IDs involved in edges
    const connectedNodeIds = new Set(
      edges.flatMap((edge) => [edge.source, edge.target]),
    );

    // Check if all activity IDs are in the connected nodes set
    const allNodesConnected = activities.every((activity) =>
      connectedNodeIds.has(activity.id),
    );

    return allNodesConnected;
  };
  // Separate validation functions to reduce complexity
  const validateProjectName = (projectFlowName: string) => {
    if (!projectFlowName || projectFlowName.trim() === '') {
      return 'Project flow name is required.';
    }
    return null;
  };

  const validateActivities = (activities: Activity[]) => {
    if (!activities || activities.length === 0 || activities.length === 1) {
      return 'At least two activities are required.';
    }

    return null;
  };

  // Display each error as a separate message toast
  const displayValidationErrors = (errors: string[]) => {
    // Using setTimeout to stagger the messages slightly for better visibility
    errors.forEach((error, index) => {
      messageApi.warning({
        content: error,
        duration: 4,
        key: `validation-error-${index}`,
      });
    });
  };

  // Main save function with reduced complexity
  const handleSaveClick = () => {
    const projectFlowName = form.getFieldValue('projectFlowName');
    const validationErrors = [];

    // Collect all validation errors
    const nameError = validateProjectName(projectFlowName);
    if (nameError) {
      validationErrors.push(nameError);
    }

    const activitiesError = validateActivities(activities);
    if (activitiesError) {
      validationErrors.push(activitiesError);
    } else if (!validateAtLeastOneConnection(activities)) {
      validationErrors.push('Each activity must have at least one connection.');
    }

    if (validationErrors.length > 0) {
      displayValidationErrors(validationErrors);
      return;
    }

    saveValidFlow(projectFlowName);
  };

  const saveValidFlow = (projectFlowName: string) => {
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
        {ProcessFlowFormText.ACTIVITIES.BUTTON.ADD_ACITIVTY}
      </Button>
      <Button danger onClick={handleClearClick} disabled={isButtonDisabled}>
        <ClearOutlined style={{ fontSize: '18px' }} />
        {ActionButtonsText.CLEAR_BUTTON}
      </Button>
      <ClearAllModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onConfirm={handleModalConfirm}
        modalAction={modalAction}
      />
    </div>
  );
};
