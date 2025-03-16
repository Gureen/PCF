import { enLanguage } from '@/language/english';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { USER_OPTIONS } from './constants';
import type { FormValues } from './types';
import { activityNameValidation } from './validation';

export const ActivityTopSection = () => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={24} md={8}>
        <Form.Item<FormValues>
          label={enLanguage.ACTIVITIES.ACTIVITY_NAME.LABEL}
          name="activityName"
          rules={activityNameValidation}
        >
          <Input
            allowClear
            placeholder={enLanguage.ACTIVITIES.ACTIVITY_NAME.PLACEHOLDER}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={8}>
        <Form.Item<FormValues>
          label={enLanguage.ACTIVITIES.USERS.LABEL}
          name="assignedUsers"
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={enLanguage.ACTIVITIES.USERS.PLACEHOLDER}
            options={USER_OPTIONS}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={8}>
        <Form.Item<FormValues>
          label={enLanguage.ACTIVITIES.DEADLINE.LABEL}
          name="deadline"
          tooltip={enLanguage.ACTIVITIES.DEADLINE.TOOLTIP}
        >
          <DatePicker
            placeholder={enLanguage.ACTIVITIES.DEADLINE.PLACEHOLDER}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};
