import { useProcessFlow } from '@/context/hooks';
import { DEFAULT_COLOR } from '@/utils';
import {
  CloseOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Form,
  type FormInstance,
  Input,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { ProcessFlowFormText } from './constants';
import { VALIDATION_RULES } from './rules';
import './styles.css';
import type { FieldType, FormValues } from './types';
import { createActivityObject } from './utils';

const { Title } = Typography;
const { TextArea } = Input;

interface ProcessFlowFormProps {
  form: FormInstance<FormValues>;
}

export const ProcessFlowForm = ({ form }: ProcessFlowFormProps) => {
  const [projectFlowName, setProjectFlowName] = useState('');

  const {
    addActivity,
    currentActivity,
    isEditing,
    updateActivity,
    cancelEditing,
    currentFlowName,
  } = useProcessFlow();

  const loadActivityData = () => {
    if (currentActivity) {
      const formData = {
        ...currentActivity,
        color: currentActivity.color || DEFAULT_COLOR,
      };
      form.setFieldsValue(formData);
    }
  };

  const updateFormBasedOnEditingState = () => {
    if (isEditing && currentActivity) {
      loadActivityData();
    } else {
      resetFormData();
    }
  };

  const resetFormData = () => {
    form.resetFields();
    const initialData = {
      color: DEFAULT_COLOR,
      projectFlowName: currentFlowName,
    };
    form.setFieldsValue(initialData);
  };

  const handleProjectFlowNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newName = e.target.value;
    setProjectFlowName(newName);
  };

  const handleFormReset = () => {
    form.resetFields();
  };

  const handleCancelEditing = () => {
    form.resetFields();
    cancelEditing();
  };

  const onFinish = (values: FormValues) => {
    const activity = createActivityObject(values, isEditing, currentActivity);

    if (isEditing && currentActivity) {
      updateActivity(activity);
    } else {
      addActivity(activity);
    }

    form.resetFields();

    if (isEditing) {
      cancelEditing();
    }
  };

  const renderButtonText = isEditing
    ? ProcessFlowFormText.ACTIVITIES.BUTTON.UPDATE
    : ProcessFlowFormText.ACTIVITIES.BUTTON.ADD_ACITIVTY;

  useEffect(() => {
    updateFormBasedOnEditingState();
  }, [currentActivity, isEditing, currentFlowName]);

  return (
    <>
      <Title level={2}>{ProcessFlowFormText.MAIN_TITLE}</Title>

      <Form
        form={form}
        name="processFlowForm"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          projectFlowName,
          color: DEFAULT_COLOR,
        }}
      >
        <Form.Item<FieldType>
          label={ProcessFlowFormText.PROJECT_FLOW.LABEL}
          name="projectFlowName"
        >
          <Input
            placeholder={ProcessFlowFormText.PROJECT_FLOW.PLACEHOLDER}
            onChange={handleProjectFlowNameChange}
          />
        </Form.Item>
        <div className="title-with-icon">
          <Title level={4}>{ProcessFlowFormText.ACTIVITIES.TITLE}</Title>
          <Tooltip title={ProcessFlowFormText.ACTIVITIES.TOOLTIP}>
            <InfoCircleOutlined className="info-icon" />
          </Tooltip>
        </div>
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.ACTIVITY_NAME.LABEL}
                name="activityName"
                rules={VALIDATION_RULES.ACTIVITY_NAME}
              >
                <Input
                  placeholder={
                    ProcessFlowFormText.ACTIVITIES.ACTIVITY_NAME.PLACEHOLDER
                  }
                  size="middle"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.DESCRIPTION.LABEL}
                name="description"
              >
                <TextArea
                  placeholder={
                    ProcessFlowFormText.ACTIVITIES.DESCRIPTION.PLACEHOLDER
                  }
                  size="middle"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.USERS.LABEL}
                name="assignedUsers"
              >
                <Select
                  mode="multiple"
                  size="middle"
                  placeholder={ProcessFlowFormText.ACTIVITIES.USERS.PLACEHOLDER}
                  options={ProcessFlowFormText.ACTIVITIES.USERS.OPTIONS}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item label={ProcessFlowFormText.ACTIVITIES.COLOR.LABEL}>
                <Row gutter={[8, 8]}>
                  <Col xs={6} sm={4} md={4} lg={3}>
                    <Form.Item<FieldType> name="color" noStyle>
                      <ColorPicker size="middle" format="hex" />
                    </Form.Item>
                  </Col>
                  <Col xs={18} sm={20} md={20} lg={21}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <Button
                        onClick={handleFormReset}
                        icon={<UndoOutlined />}
                        size="middle"
                        danger
                        style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
                      >
                        Reset
                      </Button>

                      {isEditing && (
                        <Button
                          onClick={handleCancelEditing}
                          icon={<CloseOutlined />}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        htmlType="submit"
                        icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                        size="middle"
                        type="primary"
                      >
                        {renderButtonText}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
};
