import { enLanguage } from '@/language/english';
import { Form, Input } from 'antd';
import type { FormValues } from './types';

export const ProjectFlowSection = () => {
  return (
    <Form.Item<FormValues>
      label={enLanguage.PROJECT_FLOW.LABEL}
      name="projectFlowName"
    >
      <Input placeholder={enLanguage.PROJECT_FLOW.PLACEHOLDER} />
    </Form.Item>
  );
};
