import { useProcessFlow } from '@/context/hooks';
import type { Activity } from '@/interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import { useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import { activityTemplates } from './mocks';
import './styles.css';

const { Title } = Typography;

// Map to keep track of template usage counts
const templateUsageCounts = new Map<string, number>();

// Function to reset template counts
export const resetTemplateCounts = () => {
  templateUsageCounts.clear();
};

export const ActivityTemplates = () => {
  const { currentFlowId } = useProcessFlow();

  // Reset template counts when current flow changes
  useEffect(() => {
    resetTemplateCounts();
  }, [currentFlowId]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    template: Activity,
  ) => {
    // Increment usage count for this template type
    const currentCount =
      templateUsageCounts.get(template.activityName || '') || 0;
    const newCount = currentCount + 1;
    templateUsageCounts.set(template.activityName || '', newCount);

    // Create a clone of the template with a new unique ID
    const uniqueId = `${template.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Add a counter to the activity name if this is not the first instance
    let activityName = template.activityName;
    if (newCount > 1) {
      activityName = `${template.activityName} (${newCount})`;
    }

    const templateWithUniqueId = {
      ...template,
      id: uniqueId,
      activityName: activityName,
    };

    e.dataTransfer.setData(
      'application/json',
      JSON.stringify(templateWithUniqueId),
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <>
      <div>
        <Title level={5}>
          Activity Templates
          <Tooltip title="Drag and drop templates to create your project workflow">
            <InfoCircleOutlined
              style={{ marginLeft: 8, fontSize: 16, color: '#1677ff' }}
            />
          </Tooltip>
        </Title>
      </div>
      <div className="template-container">
        {activityTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
    </>
  );
};
