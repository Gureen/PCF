import type { Activity } from "@/context";
import { Card, Space, Typography, Tag } from "antd";

const { Title, Text } = Typography;

// Predefined template activities
const activityTemplates: Activity[] = [
  {
    id: 'template-1',
    activityName: 'Content Creation',
    description: 'Creating original content for the project',
    inputs: ['Brief', 'Research'],
    outputs: ['Draft Content', 'Assets'],
    color: '#1677ff',
    assignedUsers: ['John Doe'],
  },
  {
    id: 'template-2',
    activityName: 'Review Process',
    description: 'Reviewing and approving content',
    inputs: ['Draft Content'],
    outputs: ['Approved Content', 'Revision Notes'],
    color: '#52c41a',
    assignedUsers: ['Jane Smith', 'Alex Johnson'],
  },
  {
    id: 'template-3',
    activityName: 'Client Approval',
    description: 'Getting final client sign-off',
    inputs: ['Approved Content'],
    outputs: ['Final Content', 'Client Feedback'],
    color: '#fa8c16',
    assignedUsers: ['Jane Smith'],
  },
  {
    id: 'template-4',
    activityName: 'Production',
    description: 'Finalizing content for deployment',
    inputs: ['Final Content'],
    outputs: ['Production Ready Assets'],
    color: '#722ed1',
    assignedUsers: ['Bob Wilson'],
  },
];

export const ActivityTemplates = () => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    template: Activity,
  ) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderTemplateCard = (template: Activity) => (
    <Card
      key={template.id}
      style={{ marginBottom: 16, borderLeft: `4px solid ${template.color}` }}
      hoverable
      draggable
      onDragStart={(e) => handleDragStart(e, template)}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Title level={5} style={{ margin: 0 }}>
          {template.activityName}
        </Title>
        <Text type="secondary">{template.description}</Text>

        {template.inputs && template.inputs.length > 0 && (
          <div>
            <Text strong>Inputs: </Text>
            <Space size={[0, 4]} wrap>
              {template.inputs.map((input) => (
                <Tag key={input} color="blue">
                  {input}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {template.outputs && template.outputs.length > 0 && (
          <div>
            <Text strong>Outputs: </Text>
            <Space size={[0, 4]} wrap>
              {template.outputs.map((output) => (
                <Tag key={output} color="green">
                  {output}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {template.assignedUsers && template.assignedUsers.length > 0 && (
          <div>
            <Text strong>Assigned Users: </Text>
            <Space size={[0, 4]} wrap>
              {template.assignedUsers.map((user) => (
                <Tag key={user}>{user}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );

  return (
    <>
      {activityTemplates.map((template) => renderTemplateCard(template))}
    </>
  );
};