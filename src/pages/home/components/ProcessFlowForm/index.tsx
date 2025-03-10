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
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { inputOptions, outputOptions } from '../ConfiguredActivities/constants';
import { ProcessFlowFormText } from './constants';
import './styles.css';
import { useProcessFlow } from '@/context/hooks';
import { DEFAULT_COLOR } from '@/utils';
import { VALIDATION_RULES } from './rules';
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
      <div className="title-with-icon">
        <Title level={4}>{ProcessFlowFormText.ACTIVITIES.TITLE}</Title>
        <Tooltip title={ProcessFlowFormText.ACTIVITIES.TOOLTIP}>
          <InfoCircleOutlined className="info-icon" />
        </Tooltip>
      </div>
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
          rules={VALIDATION_RULES.PROJECT_FLOW_NAME}
        >
          <Input
            placeholder={ProcessFlowFormText.PROJECT_FLOW.PLACEHOLDER}
            onChange={handleProjectFlowNameChange}
          />
        </Form.Item>

        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
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
            <Col xs={24} md={12}>
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
            <Col xs={24} sm={12} md={8}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.INPUTS.LABEL}
                name="inputs"
              >
                <Select
                  mode="tags"
                  size="middle"
                  placeholder={
                    ProcessFlowFormText.ACTIVITIES.INPUTS.PLACEHOLDER
                  }
                  options={inputOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.OUTPUTS.LABEL}
                name="outputs"
              >
                <Select
                  mode="tags"
                  size="middle"
                  placeholder={
                    ProcessFlowFormText.ACTIVITIES.OUTPUTS.PLACEHOLDER
                  }
                  options={outputOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.COLOR.LABEL}
                name="color"
              >
                <ColorPicker size="middle" format="hex" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
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
            <Col xs={24} className="action-buttons" md={24}>
              <Form.Item>
                <Space>
                  <Button
                    onClick={handleFormReset}
                    icon={<UndoOutlined />}
                    size="middle"
                    danger
                  >
                    {ProcessFlowFormText.ACTIVITIES.BUTTON.RESET_FORM}
                  </Button>

                  {isEditing && (
                    <Button
                      onClick={handleCancelEditing}
                      icon={<CloseOutlined />}
                    >
                      {ProcessFlowFormText.ACTIVITIES.BUTTON.CANCEL}
                    </Button>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                    size="middle"
                  >
                    {renderButtonText}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
};
