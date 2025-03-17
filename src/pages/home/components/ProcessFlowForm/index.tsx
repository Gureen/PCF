import { DEFAULT_COLOR } from '@/constants';
import { useProcessFlow } from '@/context/hooks';
import { enLanguage } from '@/language/english';
import {
  CloseOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  type FormInstance,
  Row,
  Typography,
} from 'antd';
import { useEffect } from 'react';
import { ActivityHeader } from './ActivityHeader';
import { ActivityTopSection } from './ActivityTopSection';
import './styles.css';
import { ActivityBottomSection } from './ActivityBottomSection';
import { ProjectFlowSection } from './ProjectFlowSection';
import type { FormValues } from './types';
import { createActivityObject } from './utils';

const { Title } = Typography;

/**
 * Props for the ProcessFlowForm component
 */
interface ProcessFlowFormProps {
  /** Form instance for controlling the form */
  form: FormInstance<FormValues>;
}

/**
 * Main form component for creating and editing process flow activities
 * Handles form submission, validation, and interaction with the process flow context
 * @param form Ant Design form instance
 * @returns React component for the process flow form
 */
export const ProcessFlowForm = ({ form }: ProcessFlowFormProps) => {
  const {
    addActivity,
    currentActivity,
    isEditing,
    updateActivity,
    cancelEditing,
    currentFlowName,
  } = useProcessFlow();

  const buttonSubmitText = isEditing
    ? enLanguage.ACTIVITIES.BUTTON.UPDATE
    : enLanguage.ACTIVITIES.BUTTON.ADD_ACITIVTY;
  const buttonSubmitIcon = isEditing ? <SaveOutlined /> : <PlusOutlined />;
  const buttonSubmitColor = isEditing ? 'green' : 'blue';

  /**
   * Resets the form fields, optionally setting default values
   * @param withDefaults Whether to set default values after reset
   */
  const resetForm = (withDefaults = true) => {
    form.resetFields();
    if (withDefaults) {
      form.setFieldsValue({
        color: DEFAULT_COLOR,
        projectFlowName: currentFlowName,
      });
    }
  };

  /**
   * Handles form submission
   * @param values Form values submitted
   */
  const onFinish = (values: FormValues) => {
    const trimmedValues = {
      ...values,
      activityName: values.activityName?.trim(),
      approvalCriteria: values.approvalCriteria?.trim(),
      description: values.description?.trim(),
    };

    const activity = createActivityObject(
      trimmedValues,
      isEditing,
      currentActivity,
    );

    if (isEditing && currentActivity) {
      updateActivity(activity);
    } else {
      addActivity(activity);
    }

    resetForm(false);

    if (isEditing) {
      cancelEditing();
    }
  };

  /**
   * Cancels the editing process and resets the form
   */
  const handleCancelEditing = () => {
    resetForm(false);
    cancelEditing();
  };

  /**
   * Initializes the form with current values when editing, or default values when creating
   */
  const initializeForm = () => {
    if (isEditing && currentActivity) {
      form.setFieldsValue({
        ...currentActivity,
        color: currentActivity.color || DEFAULT_COLOR,
      });
    } else {
      resetForm();
    }
  };

  useEffect(() => {
    initializeForm();
  }, [currentActivity, isEditing, currentFlowName, form]);

  return (
    <div className="process-flow-container">
      <Title level={3}>{enLanguage.MAIN_TITLE}</Title>
      <Form
        form={form}
        name="processFlowForm"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          color: DEFAULT_COLOR,
          projectFlowName: currentFlowName,
        }}
      >
        <ProjectFlowSection />
        <ActivityHeader />
        <Card>
          <ActivityTopSection />
          <ActivityBottomSection />
          <Row>
            <Col xs={24}>
              <div className="form-button">
                <Button
                  onClick={() => resetForm()}
                  icon={<UndoOutlined />}
                  danger
                >
                  {enLanguage.ACTIVITIES.BUTTON.RESET_FORM}
                </Button>
                {isEditing && (
                  <Button
                    onClick={handleCancelEditing}
                    icon={<CloseOutlined />}
                  >
                    {enLanguage.ACTIVITIES.BUTTON.CANCEL}
                  </Button>
                )}
                <Button
                  htmlType="submit"
                  icon={buttonSubmitIcon}
                  size="middle"
                  color={buttonSubmitColor}
                  variant="solid"
                >
                  {buttonSubmitText}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};
