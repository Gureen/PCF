import type { Activity } from '@/interfaces';
import { Card, Typography } from 'antd';
import './styles.css';

const { Title } = Typography;

/**
 * Props for the TemplateCard component
 */
interface TemplateCardProps {
  /** The activity template data to display */
  template: Activity;
  /** Function to handle the drag start event */
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    template: Activity,
  ) => void;
}

/**
 * Component representing a draggable activity template card
 * Displays a card with the template name and colored borders
 * @param template The activity template data to display
 * @param handleDragStart Function to handle the drag start event
 * @returns React component for a draggable template card
 */
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
        borderBottom: `4px solid ${template.color}`,
        height: '100%',
        minWidth: '190px',
      }}
    >
      <Title level={5} className="title">
        {template.activityName}
      </Title>
    </Card>
  );
};
