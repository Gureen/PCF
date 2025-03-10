import type { Activity } from '@/interfaces';
import { Card, Space, Typography } from 'antd';
import './styles.css';

const { Title } = Typography;

interface TemplateCardProps {
  template: Activity;
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    template: Activity,
  ) => void;
}

export const TemplateCard = ({
  template,
  handleDragStart,
}: TemplateCardProps) => {
  return (
    <Card
      className="info-icon"
      hoverable
      draggable
      onDragStart={(e) => handleDragStart(e, template)}
      style={{
        borderLeft: `4px solid ${template.color}`,
      }}
    >
      <Space>
        <Title level={5} className="title">
          {template.activityName}
        </Title>
      </Space>
    </Card>
  );
};
