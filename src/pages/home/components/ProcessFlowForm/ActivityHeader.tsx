import { enLanguage } from '@/language/english';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';

const { Title } = Typography;

/**
 * Header component for the activity section of the form
 * Displays a title with an information tooltip
 * @returns React component for the activity section header
 */
export const ActivityHeader = () => {
  return (
    <div className="title-with-icon">
      <Title level={5}>{enLanguage.ACTIVITIES.TITLE}</Title>
      <Tooltip title={enLanguage.ACTIVITIES.TOOLTIP}>
        <InfoCircleOutlined className="info-icon" />
      </Tooltip>
    </div>
  );
};
