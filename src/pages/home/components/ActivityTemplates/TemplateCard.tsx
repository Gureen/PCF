import type { Activity } from '@/interfaces';
import { Card, Typography } from 'antd';
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
      hoverable
      draggable
      onDragStart={(e) => handleDragStart(e, template)}
      style={{
        borderLeft: `4px solid ${template.color}`,
        height: '100%',
        minWidth: '160px',
      }}
    >
      <Title level={5} className="title">
        {template.activityName}
      </Title>
    </Card>
  );
};
