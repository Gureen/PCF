import { type Activity, useProcessFlow } from '@/context';
import {
  AppstoreOutlined,
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
  message
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ActionButtons } from '../ActionButtons';
import { inputOptions, outputOptions } from '../ConfiguredActivities/constants';
import { ProcessFlowFormText } from './constants';
import './styles.css';
import type { FieldType } from './types';

const { Title } = Typography;
const { TextArea } = Input;

// Default color to use when none is specified
const DEFAULT_COLOR = '#1890ff';


type ColorType = string | { toHexString?: () => string } | null | undefined;
export interface FormValues {
  projectFlowName?: string;
  activityName?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  color?: ColorType;
  assignedUsers?: string[];
}

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

  const [messageApi, contextHolder] = message.useMessage();
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && currentActivity) {
      const colorValue = currentActivity.color
        ? currentActivity.color
        : DEFAULT_COLOR;

      form.setFieldsValue({
        ...currentActivity,
        color: colorValue,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        color: DEFAULT_COLOR,
        projectFlowName: currentFlowName,
      });
    }
  }, [currentActivity, isEditing, form, currentFlowName]);

  // Extract color handling logic
  const getColorValue = (colorInput: ColorType): string => {
    // If no color input, return default
    if (!colorInput) {
      return DEFAULT_COLOR;
    }

    // If it's already a string (which it should be with format="hex"), return it
    if (typeof colorInput === 'string') {
      return colorInput;
    }

    // If it's an object (shouldn't happen with format="hex" but just in case)
    if (typeof colorInput === 'object' && colorInput.toHexString) {
      return colorInput.toHexString();
    }

    // For any other case, return default
    return DEFAULT_COLOR;
  };

  const createActivityObject = (
    values: FormValues,
    isEditing: boolean,
    currentActivity: Activity | null,
  ) => {
    return {
      id:
        isEditing && currentActivity
          ? currentActivity.id
          : Date.now().toString(),
      activityName: values.activityName,
      description: values.description,
      inputs: values.inputs || [],
      outputs: values.outputs || [],
      color: getColorValue(values.color),
      assignedUsers: values.assignedUsers || [],
    };
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

  // Handle template drops
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (formCardRef.current) {
      formCardRef.current.classList.add('dragging-over');
    }
  };

  const handleDragLeave = () => {
    if (formCardRef.current) {
      formCardRef.current.classList.remove('dragging-over');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Reset styling
    if (formCardRef.current) {
      formCardRef.current.classList.remove('dragging-over');
    }

    try {
      // Get the template data
      const templateData = JSON.parse(
        e.dataTransfer.getData('application/json'),
      );

      // If we're editing, ask user for confirmation before overwriting
      if (isEditing) {
        const proceed = window.confirm(
          'You are currently editing an activity. Do you want to replace your current changes with this template?',
        );
        if (!proceed) {
          return;
        }
      }

      // Set the form values based on the template
      form.setFieldsValue({
        activityName: templateData.activityName,
        description: templateData.description,
        color: templateData.color,
        inputs: templateData.inputs,
        outputs: templateData.outputs,
        assignedUsers: templateData.assignedUsers,
      });

      messageApi.success(
        `Template "${templateData.activityName}" loaded into form`,
      );
    } catch (error) {
      console.error('Error parsing dropped template:', error);
      messageApi.error('Could not load the template. Please try again.');
    }
  };

  return (
    <div className="process-flow-container">
      {contextHolder}
      <div className="header-container">
        <div className="title-section">
          <Title level={3}>{ProcessFlowFormText.MAIN_TITLE}</Title>
        </div>
        <div className="action-buttons-section">
          <ActionButtons form={form} />
        </div>
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
          rules={[
            { required: true, message: 'Please enter project flow name' },
          ]}
        >
          <Input
            placeholder={ProcessFlowFormText.PROJECT_FLOW.PLACEHOLDER}
            onChange={(e) => setProjectFlowName(e.target.value)}
          />
        </Form.Item>

        <div className="activities-header">
          <Title level={5}>
            {ProcessFlowFormText.ACTIVITIES.TITLE}
            <Tooltip title={ProcessFlowFormText.ACTIVITIES.TOOLTIP}>
              <InfoCircleOutlined className="info-circle-icon" />
            </Tooltip>
            <Button
              type="primary"
              icon={<AppstoreOutlined />}
              // onClick={showDrawer}
              className="templates-button"
            >
              Browse Templates
            </Button>
          </Title>
        </div>

        <Card
          className="process-flow-card"
          ref={formCardRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="drop-indicator">Drop activity template here</div>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.ACTIVITY_NAME.LABEL}
                name="activityName"
                rules={[
                  { required: true, message: 'Please enter activity name' },
                ]}
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
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} md={isEditing ? 12 : 16}>
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
            <Col xs={24} md={isEditing ? 12 : 8}>
              <Form.Item label=" " colon={false}>
                <Space wrap>
                  <Button
                    onClick={() => form.resetFields()}
                    icon={<UndoOutlined />}
                    size="middle"
                    danger
                  >
                    {ProcessFlowFormText.ACTIVITIES.BUTTON.RESET_FORM}
                  </Button>

                  {isEditing && (
                    <Button
                      onClick={() => {
                        form.resetFields();
                        cancelEditing();
                      }}
                      icon={<CloseOutlined />}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                    size="middle"
                  >
                    {isEditing
                      ? 'Update'
                      : ProcessFlowFormText.ACTIVITIES.BUTTON.ADD_ACITIVTY}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};
