import { useProcessFlow } from '@/context/hooks';
import type { Activity } from '@/interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import { useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import { activityTemplates } from './mocks';
import './styles.css';
import { enLanguage } from '@/language/english';

const { Title } = Typography;

/**
 * Keeps track of how many times each template has been used in the current flow
 * Used to append numbers to duplicate template names
 */
let templateUsageCounts: Record<string, number> = {};

/**
 * Resets the template usage counter
 * Called when clearing activities or switching flows
 */
export const resetTemplateCounts = (): void => {
  templateUsageCounts = {};
};

/**
 * Component that displays available activity templates that can be dragged onto the flow
 * Handles the drag start event and tracks template usage counts
 * @returns React component with draggable activity template cards
 */
export const ActivityTemplates = () => {
  const { currentFlowId, activities } = useProcessFlow();

  /**
   * Handles the drag start event for activity templates
   * Creates a new activity based on the template and sets the drag data
   * @param e The drag event
   * @param template The activity template being dragged
   */
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    template: Activity,
  ): void => {
    const count = (templateUsageCounts[template.activityName || ''] || 0) + 1;
    templateUsageCounts[template.activityName || ''] = count;

    const newActivity: Activity = {
      ...template,
      id: crypto.randomUUID(),
      activityName:
        count > 1
          ? `${template.activityName} (${count})`
          : template.activityName,
    };

    e.dataTransfer.setData('application/json', JSON.stringify(newActivity));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Reset template counts when changing flows
  useEffect(() => {
    resetTemplateCounts();
  }, [currentFlowId]);

  // Reset template counts when clearing all activities
  useEffect(() => {
    if (activities.length === 0) {
      resetTemplateCounts();
    }
  }, [activities]);

  return (
    <>
      <div>
        <Title level={5}>
          {enLanguage.ACTIVITY_TEMPLATES.TITLE}
          <Tooltip title={enLanguage.ACTIVITY_TEMPLATES.TOOLTIP}>
            <InfoCircleOutlined className="icon" />
          </Tooltip>
        </Title>
      </div>
      <div className="template-container">
        {activityTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            handleDragStart={(e) => handleDragStart(e, template)}
          />
        ))}
      </div>
    </>
  );
};
