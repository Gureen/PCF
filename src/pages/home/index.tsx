// Updated Home component (index.tsx)
import '@xyflow/react/dist/style.css';
import { Col, Row } from 'antd';
import { ActionButtons } from './components/ActionButtons';
import { ConfiguredActivites } from './components/ConfiguredActivities';
import { ProcessFlowForm } from './components/ProcessFlowForm';
import { ProcesFlowTable } from './components/ProcessFlowTable';
import { VisualProcessFlow } from './components/VisualProcessFlow';

const Home = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={10}>
        <ProcessFlowForm />
        <ProcesFlowTable />
      </Col>
      <Col xs={24} lg={14}>
        <ConfiguredActivites />
        <VisualProcessFlow />
        <ActionButtons />
      </Col>
    </Row>
  );
};

// biome-ignore lint/style/noDefaultExport: Pages are allowed due to routes.ts setup
export default Home;
