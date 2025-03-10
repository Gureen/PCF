import type { Activity } from '@/interfaces';
import { Card, Col, Space, Tag, Typography } from 'antd';
import './styles.css';

const { Title, Text } = Typography;

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
  const hasInputs = template.inputs && template.inputs.length > 0;
  const hasOutputs = template.outputs && template.outputs.length > 0;
  const hasAssignedUsers =
    template.assignedUsers && template.assignedUsers.length > 0;

  return (
    <Col span={8} key={template.id}>
      <Card
        className="info-icon"
        hoverable
        draggable
        onDragStart={(e) => handleDragStart(e, template)}
      >
        <Space direction="vertical" size="small">
          <Title level={5} className="title">
            {template.activityName}
          </Title>
          <Text type="secondary">{template.description}</Text>

          {hasInputs && (
            <div>
              <Text strong>Inputs: </Text>
              <Space size={[0, 4]} wrap>
                {template?.inputs?.map((input) => (
                  <Tag key={input} color="blue">
                    {input}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {hasOutputs && (
            <div>
              <Text strong>Outputs: </Text>
              <Space size={[0, 4]} wrap>
                {template?.outputs?.map((output) => (
                  <Tag key={output} color="green">
                    {output}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {hasAssignedUsers && (
            <div>
              <Text strong>Assigned Users: </Text>
              <Space size={[0, 4]} wrap>
                {template?.assignedUsers?.map((user) => (
                  <Tag key={user}>{user}</Tag>
                ))}
              </Space>
            </div>
          )}
        </Space>
      </Card>
    </Col>
  );
};
