import { edgeTypes, initialEdges } from '@/components/edges';
import { initialNodes, nodeTypes } from '@/components/nodes';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Background,
  Controls,
  MiniMap,
  type OnConnect,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FormProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  List,
  Row,
  Tag,
  Typography,
} from 'antd';
import { useCallback, useState } from 'react';
import { ActivityConfiguration } from './components/ActivityConfiguration';
import { SavedFlowsTable } from './components/SavedFlowsTable';

const { Title } = Typography;

const Home = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [form] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [projectFlowName, setProjectFlowName] = useState('');
  type ActivityType = {
    id: string;
    activityName: string;
    description: string;
    inputs: string[];
    outputs: string[];
    assignedUsers: string[];
    isEmpty?: boolean;
  };

  const [activities, setActivities] = useState<ActivityType[]>([
    {
      id: '1',
      activityName: 'Content Creation',
      description: 'Create initial content for review',
      inputs: ['Requirements', 'Brand guidelines'],
      outputs: ['Draft document'],
      assignedUsers: ['John Doe'],
    },
    {
      id: '2',
      activityName: 'Editorial Review',
      description: 'Review and edit the content',
      inputs: ['Draft document'],
      outputs: ['Edited document'],
      assignedUsers: ['Jane Smith'],
    },
    {
      id: '3',
      activityName: 'Legal Review',
      description: 'Review for legal compliance',
      inputs: ['Edited document'],
      outputs: ['Approved document'],
      assignedUsers: ['Robert Johnson'],
    },
  ]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );

  // Flow container style
  const flowContainerStyle = {
    height: '40vh',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '24px',
  };

  type FieldType = {
    projectFlowName?: string;
    activityName?: string;
    description?: string;
    inputs?: string[];
    outputs?: string[];
    assignedUsers?: string[];
  };

  const onProjectFormFinish = (values: { projectFlowName?: string }) => {
    if (values.projectFlowName) {
      setProjectFlowName(values.projectFlowName);
    }
  };

  const onActivityFormFinish: FormProps<FieldType>['onFinish'] = (values) => {
    // Add new activity to the list
    if (values.activityName) {
      const newActivity = {
        id: Date.now().toString(),
        activityName: values.activityName || '',
        description: values.description || '',
        inputs: values.inputs || [],
        outputs: values.outputs || [],
        assignedUsers: values.assignedUsers || [],
      };

      setActivities([...activities, newActivity]);

      // Reset activity form fields
      form.resetFields();
    }
  };

  // Delete activity handler
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  const displayItems = Array(4)
    .fill(null)
    .map((_, index) => {
      return activities[index] || { id: `empty-${index}`, isEmpty: true };
    });

  return (
    <div
      style={{
        paddingInline: '60px',
        backgroundColor: '#F8F8F8',
      }}
    >
      <Row gutter={[30, 10]}>
        <Col xs={24} lg={8}>
          <div style={{ paddingRight: '20px' }}>
            <Title level={2}>Process flow configurator</Title>

            {/* Project Name Form */}
            <Form
              form={projectForm}
              name="processFlowForm"
              layout="vertical"
              onFinish={onProjectFormFinish}
              autoComplete="off"
              initialValues={{ projectFlowName }}
            >
              <Form.Item<FieldType>
                label={<span>Project Flow Name</span>}
                name="projectFlowName"
                rules={[
                  {
                    required: true,
                    message: 'Please input project flow name!',
                  },
                ]}
              >
                <Input
                  placeholder="Enter process flow name"
                  onChange={(e) => setProjectFlowName(e.target.value)}
                />
              </Form.Item>
            </Form>

            {/* Compact Activity Configuration */}
            <ActivityConfiguration
              form={form}
              onFinish={onActivityFormFinish}
            />

            {/* Saved Flows Table */}
            <SavedFlowsTable />
          </div>
        </Col>

        <Col xs={24} lg={16}>
          <div style={{ paddingLeft: '40px' }}>
            <Title level={5} style={{ marginBottom: '8px' }}>
              Configured Activities
            </Title>

            <List
              itemLayout="vertical"
              dataSource={displayItems}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              renderItem={(item) => (
                <List.Item>
                  {item.isEmpty ? (
                    <Empty
                      style={{ minHeight: '128px' }}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Typography.Text style={{ color: '#faad14' }}>
                          Activity not configured
                        </Typography.Text>
                      }
                    ></Empty>
                  ) : (
                    <Card
                      title={item.activityName}
                      size="small"
                      extra={
                        <div>
                          <Button
                            icon={<EditOutlined />}
                            type="text"
                            style={{ marginRight: '8px' }}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => handleDeleteActivity(item.id)}
                          />
                        </div>
                      }
                    >
                      <p style={{ margin: '0 0 8px' }}>{item.description}</p>

                      {item.inputs && item.inputs.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>Inputs: </strong>
                          {item.inputs.map((input) => (
                            <Tag key={input} color="blue">
                              {input}
                            </Tag>
                          ))}
                        </div>
                      )}

                      {item.outputs && item.outputs.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>Outputs: </strong>
                          {item.outputs.map((output) => (
                            <Tag key={output} color="green">
                              {output}
                            </Tag>
                          ))}
                        </div>
                      )}

                      {item.assignedUsers && (
                        <div>
                          <strong>Assigned to: </strong>
                          {item.assignedUsers.map((user) => (
                            <Tag key={user} color="purple">
                              {user}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}
                </List.Item>
              )}
            />

            <div style={flowContainerStyle}>
              <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                edgeTypes={edgeTypes}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <Background bgColor="white" />
                <MiniMap />
                <Controls />
              </ReactFlow>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
              marginBottom: '40px',
            }}
          >
            <Button type="primary">Save Process Flow</Button>
            <Button danger>Clear All</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
