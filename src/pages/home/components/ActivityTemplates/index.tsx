import type { Activity } from '@/interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Tooltip, Typography } from 'antd';
import { TemplateCard } from './TemplateCard';
import { activityTemplates } from './mocks';

const { Title } = Typography;

export const ActivityTemplates = () => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    template: Activity,
  ) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <>
      <div>
        <Title level={5}>
          Activites Templates
          <Tooltip title="Drag and drop templates to create your project workflow">
            <InfoCircleOutlined
              style={{ marginLeft: 8, fontSize: 16, color: '#1677ff' }}
            />
          </Tooltip>
        </Title>
      </div>
      <Row gutter={24}>
        {activityTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            handleDragStart={handleDragStart}
          />
        ))}
      </Row>
    </>
  );
};
