import { Button, type FormInstance, message } from 'antd';
import { useState } from 'react';
import { ClearAllModal } from '../ClearAllModal';
import './styles.css';
import { useProcessFlow } from '@/context/hooks';
import type { Activity } from '@/interfaces';
import { enLanguage } from '@/language/english';
import { ClearOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import type { FormValues } from '../ProcessFlowForm/types';
import { generateEdgesFromActivities } from '../VisualProcessFlow/utils';

/**
 * Props for the ActionButtons component
 */
interface ActionButtonsProps {
  /** Form instance to access form values */
  form: FormInstance<FormValues>;
}

/**
 * Component that provides action buttons for the process flow
 * Handles creating, saving, and clearing flows
 * @param form Form instance to access form values
 * @returns React component with action buttons and confirmation modal
 */
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

  /**
   * Opens the confirmation modal with the specified action type
   * @param action The type of action to confirm ('clear' or 'new')
   */
  const showModal = (action: 'clear' | 'new') => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  /**
   * Handles clicking the clear button
   * Shows confirmation modal if there are activities to clear
   */
  const handleClearClick = () => {
    if (activities && activities.length > 0) {
      showModal('clear');
    }
  };

  /**
   * Handles clicking the new flow button
   * Shows confirmation modal if there are unsaved changes
   */
  const handleNewClick = () => {
    if (hasChanges) {
      showModal('new');
    } else {
      createNewFlow();
    }
  };

  /**
   * Creates a new flow by resetting the form and clearing activities
   */
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

  /**
   * Handles confirmation from the modal
   * Performs the appropriate action based on modalAction
   */
  const handleModalConfirm = () => {
    if (modalAction === 'clear') {
      clearActivities();
    } else if (modalAction === 'new') {
      createNewFlow();
    }
    setIsModalOpen(false);
  };

  /**
   * Validates that at least one connection exists between activities
   * @param activities Array of activities to validate
   * @returns Boolean indicating whether all nodes are connected
   */
  const validateAtLeastOneConnection = (activities: Activity[]) => {
    if (!activities || activities.length < 2) {
      return false;
    }

    const edges = generateEdgesFromActivities(activities);

    if (edges.length === 0) {
      return false;
    }

    const connectedNodeIds = new Set(
      edges.flatMap((edge) => [edge.source, edge.target]),
    );

    const allNodesConnected = activities.every((activity) =>
      connectedNodeIds.has(activity.id),
    );

    return allNodesConnected;
  };

  /**
   * Validates the project name
   * @param projectFlowName The project flow name to validate
   * @returns Error message if validation fails, null if valid
   */
  const validateProjectName = (projectFlowName: string) => {
    if (!projectFlowName || projectFlowName.trim() === '') {
      return enLanguage.ACTION_BUTTONS.MESSAGES.VALIDATION
        .PROJECT_NAME_REQUIRED;
    }
    return null;
  };

  /**
   * Validates that at least two activities exist
   * @param activities Array of activities to validate
   * @returns Error message if validation fails, null if valid
   */
  const validateActivities = (activities: Activity[]) => {
    if (!activities || activities.length === 0 || activities.length === 1) {
      return enLanguage.ACTION_BUTTONS.MESSAGES.VALIDATION
        .TWO_ACTIVITIES_REQUIRED;
    }

    return null;
  };

  /**
   * Displays validation error messages
   * @param errors Array of error messages to display
   */
  const displayValidationErrors = (errors: string[]) => {
    errors.forEach((error, index) => {
      messageApi.warning({
        content: error,
        duration: 4,
        key: `validation-error-${index}`,
      });
    });
  };

  /**
   * Handles clicking the save button
   * Validates form values and activities before saving
   */
  const handleSaveClick = () => {
    const projectFlowName = form.getFieldValue('projectFlowName');
    const validationErrors = [];

    const nameError = validateProjectName(projectFlowName);
    if (nameError) {
      validationErrors.push(nameError);
    }

    const activitiesError = validateActivities(activities);
    if (activitiesError) {
      validationErrors.push(activitiesError);
    } else if (!validateAtLeastOneConnection(activities)) {
      validationErrors.push(
        enLanguage.ACTION_BUTTONS.MESSAGES.VALIDATION.CONNECTION_REQUIRED,
      );
    }

    if (validationErrors.length > 0) {
      displayValidationErrors(validationErrors);
      return;
    }

    saveValidFlow(projectFlowName);
  };

  /**
   * Saves a valid flow and shows appropriate messages
   * @param projectFlowName Name of the flow to save
   */
  const saveValidFlow = (projectFlowName: string) => {
    const result = saveFlow(projectFlowName);

    if (result.isNew) {
      messageApi.success({
        content: enLanguage.ACTION_BUTTONS.MESSAGES.PROCESS_CREATED,
      });
    } else if (result.isUpdated) {
      messageApi.info({
        content: enLanguage.ACTION_BUTTONS.MESSAGES.PROCESS_UPDATED,
      });
    }

    if (form.getFieldValue('projectFlowName') !== projectFlowName) {
      form.setFieldsValue({ projectFlowName });
    }
  };

  const isButtonDisabled = !activities || activities.length === 0;
  const isSaveButtonDisabled = !!currentFlowId && !hasChanges;

  return (
    <div className="action-buttons">
      {contextHolder}
      <Button type="primary" onClick={handleNewClick}>
        <PlusOutlined className="button-style" />
        {enLanguage.ACTION_BUTTONS.NEW_BUTTON}
      </Button>
      <Button
        onClick={handleSaveClick}
        disabled={isSaveButtonDisabled}
        color="green"
        variant="solid"
      >
        <SaveOutlined className="button-style" />
        {currentFlowId
          ? enLanguage.ACTION_BUTTONS.UPDATE_BUTTON
          : enLanguage.ACTION_BUTTONS.ADD_BUTTON}
      </Button>
      <Button danger onClick={handleClearClick} disabled={isButtonDisabled}>
        <ClearOutlined className="button-style" />
        {enLanguage.ACTION_BUTTONS.CLEAR_BUTTON}
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
