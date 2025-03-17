import { enLanguage } from '@/language/english';
import { Form, Input } from 'antd';
import type { FormValues } from './types';

/**
 * Component that renders the project flow name input section
 * Allows users to specify the name of the current flow
 * @returns React component with the project flow name input field
 */
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
