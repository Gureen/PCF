import '@xyflow/react/dist/style.css';
import { Col, Row } from 'antd';
import { ActionButtons } from './components/ActionButtons';
import { ConfiguredActivites } from './components/ConfiguredActivities';
import { ProcessFlowForm } from './components/ProcessFlowForm';
import { ProcesFlowTable } from './components/ProcessFlowTable';
import { VisualProcessFlow } from './components/VisualProcessFlow';

const Home = () => {
  return (
    <Row gutter={24}>
      <Col span={10}>
        <ProcessFlowForm />
        <ProcesFlowTable />
      </Col>
      <Col span={14}>
        <ConfiguredActivites />
        <VisualProcessFlow />
        <ActionButtons />
      </Col>
    </Row>
  );
};

export default Home;
