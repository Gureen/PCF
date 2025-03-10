// Updated Home component (index.tsx)
import '@xyflow/react/dist/style.css';
import { ProcessFlowProvider } from '@/context';
import { Col, Form, Row } from 'antd';
import { ProcessFlowForm } from './components/ProcessFlowForm';
import { ProcessFlowTable } from './components/ProcessFlowTable';
import { VisualProcessFlow } from './components/VisualProcessFlow';
import { ActivityTemplates } from './components/ActivityTemplates';
import { ActionButtons } from './components/ActionButtons';

const Home = () => {
  const [form] = Form.useForm();

  return (
    <ProcessFlowProvider>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <ProcessFlowForm form={form} />
          <ProcessFlowTable />
        </Col>
        <Col xs={24} lg={14}>
                  <ActionButtons form={form} />
        
          <ActivityTemplates/>
          <VisualProcessFlow />
        </Col>
      </Row>
    </ProcessFlowProvider>
  );
};

// biome-ignore lint/style/noDefaultExport: Pages are allowed due to routes.ts setup
export default Home;
