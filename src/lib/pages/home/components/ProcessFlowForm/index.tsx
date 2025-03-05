import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';
import { ProcessFlowFormText } from './constants';
import type { FieldType } from './types';
import './styles.css';

const { Title } = Typography;
const { TextArea } = Input;

export const ProcessFlowForm = () => {
  const [form] = Form.useForm();
  const [projectFlowName, setProjectFlowName] = useState('');

  const onFinish = () => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('mock');
  };

  return (
    <div>
      <Title level={3}>{ProcessFlowFormText.MAIN_TITLE}</Title>

      <Form
        form={form}
        name="processFlowForm"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ projectFlowName }}
      >
        <Form.Item<FieldType>
          label={ProcessFlowFormText.PROJECT_FLOW.LABEL}
          name="projectFlowName"
        >
          <Input
            placeholder={ProcessFlowFormText.PROJECT_FLOW.PLACEHOLDER}
            onChange={(e) => setProjectFlowName(e.target.value)}
          />
        </Form.Item>
        <Title level={5}>
          {' '}
          {ProcessFlowFormText.ACTIVITIES.TITLE}
          <Tooltip title={ProcessFlowFormText.ACTIVITIES.TOOLTIP}>
            <InfoCircleOutlined className="info-circle-icon" />
          </Tooltip>
        </Title>
        <Card className="process-flow-card">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.ACTIVITY_NAME.LABEL}
                name="activityName"
              >
                <Input
                  placeholder={
                    ProcessFlowFormText.ACTIVITIES.ACTIVITY_NAME.PLACEHOLDER
                  }
                  size="middle"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
          <Row gutter={16}>
            <Col span={8}>
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
                  options={[]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
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
                  options={[]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label={ProcessFlowFormText.ACTIVITIES.COLOR.LABEL}
                name="color"
              >
                <ColorPicker size="middle" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col span={16}>
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
            <Col span={8} className="submit-button-container">
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                size="middle"
              >
                {ProcessFlowFormText.ACTIVITIES.BUTTON.TEXT}
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};
