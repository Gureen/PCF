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

let templateUsageCounts: Record<string, number> = {};

export const resetTemplateCounts = (): void => {
  templateUsageCounts = {};
};

export const ActivityTemplates = () => {
  const { currentFlowId, activities } = useProcessFlow();

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

  useEffect(() => {
    resetTemplateCounts();
  }, [currentFlowId]);

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
