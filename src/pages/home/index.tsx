import { Col, Form, Row } from 'antd';
import { ActionButtons } from './components/ActionButtons';
import { ActivityTemplates } from './components/ActivityTemplates';
import { ProcessFlowContainer } from './components/ProcessFlowContainer';
import { ProcessFlowForm } from './components/ProcessFlowForm';
import { VisualProcessFlow } from './components/VisualProcessFlow';

const Home = () => {
  const [form] = Form.useForm();

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={10}>
        <ProcessFlowForm form={form} />
        <ProcessFlowContainer />
      </Col>
      <Col xs={24} lg={14}>
        <ActionButtons form={form} />
        <ActivityTemplates />
        <VisualProcessFlow />
      </Col>
    </Row>
  );
};

// biome-ignore lint/style/noDefaultExport: Pages are allowed due to routes.ts setup
export default Home;
