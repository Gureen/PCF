import { enLanguage } from '@/language/english';
import { Col, ColorPicker, Form, Input, Row } from 'antd';
import type { FormValues } from './types';
import {
  approvalCriteriaValidation,
  descriptionValidation,
} from './validation';

const { TextArea } = Input;

/**
 * Component that renders the bottom section of the activity form
 * Contains approval criteria, description, and color picker inputs
 * @returns React component with form items for the bottom section
 */
export const ActivityBottomSection = () => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={24} md={10}>
        <Form.Item<FormValues>
          label={enLanguage.ACTIVITIES.APPROVAL_CRITERIA.LABEL}
          name="approvalCriteria"
          tooltip={enLanguage.ACTIVITIES.APPROVAL_CRITERIA.TOOLTIP}
          rules={approvalCriteriaValidation}
        >
          <TextArea
            allowClear
            placeholder={enLanguage.ACTIVITIES.APPROVAL_CRITERIA.PLACEHOLDER}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={10}>
        <Form.Item<FormValues>
          label={enLanguage.ACTIVITIES.DESCRIPTION.LABEL}
          name="description"
          rules={descriptionValidation}
        >
          <TextArea
            allowClear
            placeholder={enLanguage.ACTIVITIES.DESCRIPTION.PLACEHOLDER}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={4}>
        <Form.Item name="color" label={enLanguage.ACTIVITIES.COLOR.LABEL}>
          <ColorPicker size="middle" format="hex" />
        </Form.Item>
      </Col>
    </Row>
  );
};
