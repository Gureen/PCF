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
import { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { edgeTypes, initialEdges } from '@/components/edges';
import { initialNodes, nodeTypes } from '@/components/nodes';
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import type { FormProps } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const Home = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [form] = Form.useForm();
  const [activities, setActivities] = useState([
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
      activityName: 'Editorial Review',
      description: 'Review and edit the content',
      inputs: ['Draft document'],
      outputs: ['Edited document'],
      assignedUsers: ['Jane Smith'],
    },
    {
      id: '4',
      activityName: 'Editorial Review',
      description: 'Review and edit the content',
      inputs: ['Draft document'],
      outputs: ['Edited document'],
      assignedUsers: ['Jane Smith'],
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

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    // Add new activity to the list
    const newActivity = {
      id: Date.now().toString(),
      activityName: values.activityName || '',
      description: values.description || '',
      inputs: values.inputs || [],
      outputs: values.outputs || [],
      assignedUsers: values.assignedUsers || [],
    };

    setActivities([...activities, newActivity]);

    // Reset form fields
    form.resetFields([
      'activityName',
      'description',
      'inputs',
      'outputs',
      'assignedUsers',
    ]);
  };

  const infoStyle = {
    backgroundColor: '#e6f7ff',
    border: '1px solid #91d5ff',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  };

  // Delete activity handler
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <div style={{ paddingInline: '60px' }}>
      <Row gutter={[30, 10]}>
        <Col xs={24} lg={8}>
          <div style={{ paddingRight: '20px' }}>
            <Title level={2}>Process flow configurator</Title>
            <Form
              form={form}
              name="processFlowForm"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
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
                <Input placeholder="Enter process flow name" />
              </Form.Item>

              {/* Visual Separator */}
              <div
                style={{
                  marginTop: '24px',
                  marginBottom: '24px',
                  borderTop: '1px solid #f0f0f0',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '20px',
                    background: '#fff',
                    padding: '0 10px',
                    color: '#1890ff',
                    fontWeight: '500',
                  }}
                >
                  Activities Configuration
                </div>
              </div>

              <div style={infoStyle}>
                <InfoCircleOutlined
                  style={{ fontSize: '20px', color: '#1890ff' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    Activity Configuration
                  </div>
                  <div>
                    Configure a new activity node for your process flow. Maximum
                    4 nodes allowed.
                  </div>
                </div>
              </div>

              <Space
                direction="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Form.Item<FieldType>
                    label={<span>Activity name</span>}
                    name="activityName"
                    rules={[
                      {
                        required: true,
                        message: 'Please input activity name!',
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="E.g., Content Creation, Review, Approval" />
                  </Form.Item>

                  <Form.Item<FieldType>
                    label={<span>Description</span>}
                    name="description"
                    rules={[
                      { required: true, message: 'Please input description!' },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <TextArea
                      rows={2}
                      placeholder="Describe the purpose and actions of this activity step"
                      style={{ minHeight: '60px' }}
                    />
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <Form.Item<FieldType>
                    label={<span>Inputs (optional)</span>}
                    name="inputs"
                    style={{ flex: 1 }}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Add inputs (e.g., 'Draft document', 'Customer data')"
                      options={[]}
                    />
                  </Form.Item>

                  <Form.Item<FieldType>
                    label={<span>Outputs (optional)</span>}
                    name="outputs"
                    style={{ flex: 1 }}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Add outputs (e.g., 'Approved document', 'Final report')"
                      options={[]}
                    />
                  </Form.Item>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-end',
                  }}
                >
                  <Form.Item<FieldType>
                    label={<span>Assigned Users</span>}
                    name="assignedUsers"
                    rules={[
                      { required: true, message: 'Please assign users!' },
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="Select team members"
                      options={[
                        { value: 'John Doe', label: 'John Doe' },
                        { value: 'Jane Smith', label: 'Jane Smith' },
                        { value: 'Robert Johnson', label: 'Robert Johnson' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit">
                      Add Activity
                    </Button>
                  </Form.Item>
                </div>
              </Space>
            </Form>
          </div>
        </Col>

        <Col xs={24} lg={16}>
          <div style={{ paddingLeft: '20px', borderLeft: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ marginBottom: '8px' }}>
              Configured Activities
            </Title>

            {activities.length > 0 ? (
              <>
                <List
                  itemLayout="vertical"
                  dataSource={activities.slice(0, 2)}
                  grid={{
                    gutter: 24,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                  }}
                  renderItem={(item) => (
                    <List.Item>
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

                        {item.inputs.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Inputs: </strong>
                            {item.inputs.map((input) => (
                              <Tag key={input} color="blue">
                                {input}
                              </Tag>
                            ))}
                          </div>
                        )}

                        {item.outputs.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Outputs: </strong>
                            {item.outputs.map((output) => (
                              <Tag key={output} color="green">
                                {output}
                              </Tag>
                            ))}
                          </div>
                        )}

                        <div>
                          <strong>Assigned to: </strong>
                          {item.assignedUsers.map((user) => (
                            <Tag key={user} color="purple">
                              {user}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />

                <List
                  itemLayout="vertical"
                  dataSource={activities.slice(2)}
                  grid={{
                    gutter: 24,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                  }}
                  style={{ marginTop: '8px' }}
                  renderItem={(item) => (
                    <List.Item>
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

                        {item.inputs.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Inputs: </strong>
                            {item.inputs.map((input) => (
                              <Tag key={input} color="blue">
                                {input}
                              </Tag>
                            ))}
                          </div>
                        )}

                        {item.outputs.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Outputs: </strong>
                            {item.outputs.map((output) => (
                              <Tag key={output} color="green">
                                {output}
                              </Tag>
                            ))}
                          </div>
                        )}

                        <div>
                          <strong>Assigned to: </strong>
                          {item.assignedUsers.map((user) => (
                            <Tag key={user} color="purple">
                              {user}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                No activities configured yet. Add your first activity using the
                form.
              </div>
            )}

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
                <Background />
                <MiniMap />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        </Col>
      </Row>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px',
        }}
      >
        <Button type="primary">Save Process Flow</Button>
        <Button>Export as JSON</Button>
        <Button>Clear All</Button>
      </div>
    </div>
  );
};

export default Home;
