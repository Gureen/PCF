import {
  CloudDownloadOutlined,
  DragOutlined,
  ImportOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Space, Typography } from 'antd';

const { Title, Text } = Typography;

export const EmptyFlowMessage = () => {
  return (
    <div className="empty-flow-message">
      <Space direction="vertical" align="center" size="large">
        <Title level={3}>Your process flow is empty</Title>

        <Space direction="vertical" align="center" size={16}>
          <Text type="secondary" style={{ fontSize: 16 }}>
            <DragOutlined style={{ marginRight: 8, fontSize: 18 }} />
            Drag and drop activity templates here
          </Text>
          <Text type="secondary" style={{ fontSize: 16 }}>
            <ImportOutlined style={{ marginRight: 8, fontSize: 18 }} />
            Import your own flows
          </Text>
          <Text type="secondary" style={{ fontSize: 16 }}>
            <CloudDownloadOutlined style={{ marginRight: 8, fontSize: 18 }} />
            Load existing flows
          </Text>
          <Text type="secondary" style={{ fontSize: 16 }}>
            <SettingOutlined style={{ marginRight: 8, fontSize: 18 }} />
            Create new ones using activity configurator
          </Text>
        </Space>
      </Space>
    </div>
  );
};
