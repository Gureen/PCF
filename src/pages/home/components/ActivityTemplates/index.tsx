import type { Activity } from "@/context";
import { Card, Space, Typography, Tag, Row, Col, Tooltip } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';

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
    <Col span={8} key={template.id}>
      <Card
        style={{ 
          marginBottom: 16, 
          height: '100%',
          borderLeft: `4px solid ${template.color}` 
        }}
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
    </Col>
  );

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 8 }}>
          Activites Templates
          <Tooltip title="Drag and drop templates to create your project workflow">
            <InfoCircleOutlined style={{ marginLeft: 8, fontSize: 16 }} />
          </Tooltip>
        </Title>
      </div>
      <Row gutter={24}>
        {activityTemplates.map((template) => renderTemplateCard(template))}
      </Row>
    </>
  );
};