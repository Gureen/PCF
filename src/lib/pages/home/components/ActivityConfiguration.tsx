import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
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

type FieldType = {
  activityName?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  color?: string;
  assignedUsers?: string[];
};

interface CompactActivityConfigProps {
  form: FormProps<FieldType>['form'];
  onFinish: FormProps<FieldType>['onFinish'];
}

export const ActivityConfiguration: React.FC<CompactActivityConfigProps> = ({
  form,
  onFinish,
}) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <Card
        key="1"
        style={{ border: '1px solid #f0f0f0', borderRadius: '4px' }}
      >
        <Typography>
          Activities configurator
          <Tooltip title="(Configure activity nodes - maximum 4 allowed)">
            <InfoCircleOutlined
              style={{ fontSize: '16px', color: '#1890ff', marginLeft: '8px' }}
            />
          </Tooltip>
        </Typography>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: '8px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Activity name"
                name="activityName"
                rules={[{ required: true, message: 'Required' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input
                  placeholder="E.g., Content Creation, Review"
                  size="middle"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Required' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input
                  placeholder="Brief description of this activity"
                  size="middle"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Inputs"
                name="inputs"
                style={{ marginBottom: '8px' }}
              >
                <Select
                  mode="tags"
                  size="middle"
                  placeholder="Add inputs"
                  options={[]}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Outputs"
                name="outputs"
                style={{ marginBottom: '12px' }}
              >
                <Select
                  mode="tags"
                  size="middle"
                  placeholder="Add outputs"
                  options={[]}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Color"
                name="color"
                style={{ marginBottom: '12px' }}
              >
                <ColorPicker size="middle" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} align="middle">
            <Col span={16}>
              <Form.Item<FieldType>
                label="Assigned Users"
                name="assignedUsers"
                rules={[{ required: true, message: 'Required' }]}
                style={{ marginBottom: '12px' }}
              >
                <Select
                  mode="multiple"
                  size="middle"
                  placeholder="Select users"
                  options={[
                    { value: 'John Doe', label: 'John Doe' },
                    { value: 'Jane Smith', label: 'Jane Smith' },
                    { value: 'Robert Johnson', label: 'Robert Johnson' },
                  ]}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right', paddingTop: '28px' }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                size="middle"
              >
                Add Activity
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};
