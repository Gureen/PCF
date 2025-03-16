import { DEFAULT_COLOR } from '@/constants/text';
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
interface ProcessFlowFormProps {
  form: FormInstance<FormValues>;
}

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

  const resetForm = (withDefaults = true) => {
    form.resetFields();
    if (withDefaults) {
      form.setFieldsValue({
        color: DEFAULT_COLOR,
        projectFlowName: currentFlowName,
      });
    }
  };

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

  const handleCancelEditing = () => {
    resetForm(false);
    cancelEditing();
  };

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
