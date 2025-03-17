import { useProcessFlow } from '@/context/hooks';
import type { Activity } from '@/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
  Panel,
  ReactFlow,
  addEdge,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Space, Tooltip, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './styles.css';
import { EmptyFlowMessage } from './EmptyFlowMessage';
import { edgeTypes, nodeTypes } from './types';
import {
  addConnection,
  calculateNodePositions,
  detectCircularDependencies,
  findActivityById,
  findEdgeById,
  generateEdgesFromActivities,
  processEdgeRemovals,
  removeConnection,
  updateActivityPosition,
  validateConnectionLimits,
} from './utils';

export const VisualProcessFlow = () => {
  const {
    activities,
    addActivity,
    deleteActivity,
    editActivity,
    setActivities,
  } = useProcessFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const initialNodes = calculateNodePositions(activities);
  const initialEdges = generateEdgesFromActivities(activities);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [messageApi, contextHolder] = message.useMessage();

  const handleEdgesChange = (changes: EdgeChange[]): void => {
    const removals = changes.filter((change) => change.type === 'remove');

    if (removals.length === 0) {
      onEdgesChange(changes);
      return;
    }

    const { updatedActivities, shouldUpdate } = processEdgeRemovals(
      removals,
      edges,
      activities,
    );

    if (shouldUpdate) {
      setActivities(updatedActivities);
    }

    onEdgesChange(changes);
  };

  const onConnect = (connection: Connection): void => {
    const newEdge = {
      id: `e-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
    };

    const tempEdges = [...edges, newEdge];
    const nodes = activities.map((activity) => ({ id: activity.id }));

    if (detectCircularDependencies(nodes, tempEdges)) {
      messageApi.error({
        content: 'Cannot create circular dependency in the flow',
        duration: 4,
      });
      return;
    }

    const sourceActivity = activities.find(
      (activity) => activity.id === connection.source,
    );
    const targetActivity = activities.find(
      (activity) => activity.id === connection.target,
    );

    if (!(sourceActivity && targetActivity)) {
      return;
    }

    if (!validateConnectionLimits(sourceActivity, targetActivity, messageApi)) {
      return;
    }

    setEdges((eds) => addEdge(connection, eds));

    const outputValue = targetActivity.activityName || targetActivity.id;
    const inputValue = sourceActivity.activityName || sourceActivity.id;

    const updatedActivities = activities.map((activity) => {
      const withOutput = addConnection(
        activity,
        sourceActivity.id,
        outputValue,
        'outputs',
      );
      if (withOutput !== activity) {
        return withOutput;
      }

      return addConnection(activity, targetActivity.id, inputValue, 'inputs');
    });

    setActivities(updatedActivities);
  };

  const onNodeClick: NodeMouseHandler = (_, node: Node): void => {
    setSelectedNode(node.id);
  };

  const onNodeDoubleClick: NodeMouseHandler = (_, node: Node): void => {
    editActivity(node.id);
  };

  const handleDeleteNode = (): void => {
    if (selectedNode) {
      deleteActivity(selectedNode);
      setSelectedNode(null);
    }
  };

  const handleEditNode = (): void => {
    if (selectedNode) {
      editActivity(selectedNode);
      setSelectedNode(null);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();

    const jsonData = event.dataTransfer.getData('application/json');
    if (!jsonData) {
      return;
    }

    try {
      const templateActivity = JSON.parse(jsonData) as Activity;

      const newActivity: Activity = {
        ...templateActivity,
        id: crypto.randomUUID(),
      };

      addActivity(newActivity);
    } catch (error) {
      console.error('Error dropping activity template:', error);
    }
  };

  const onNodeDragStop: NodeMouseHandler = (_, node) => {
    const updatedActivities = updateActivityPosition(
      activities,
      node.id,
      node.position,
    );

    setActivities(updatedActivities);
  };

  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes);
  };

  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = (): void => {
    edgeReconnectSuccessful.current = false;
  };

  const onReconnect = (oldEdge: Edge, newConnection: Connection): void => {
    edgeReconnectSuccessful.current = true;

    const sourceActivity = findActivityById(newConnection.source, activities);
    const targetActivity = findActivityById(newConnection.target, activities);

    if (sourceActivity && targetActivity) {
      const oldSourceActivity = findActivityById(oldEdge.source, activities);
      const oldTargetActivity = findActivityById(oldEdge.target, activities);

      if (oldSourceActivity && oldTargetActivity) {
        const oldOutputValue =
          oldTargetActivity.activityName || oldTargetActivity.id;
        const oldInputValue =
          oldSourceActivity.activityName || oldSourceActivity.id;

        let updatedActivities = activities.map((activity) => {
          let updatedActivity = activity;

          if (activity.id === oldEdge.source) {
            updatedActivity = removeConnection(
              updatedActivity,
              oldEdge.source,
              oldOutputValue,
              'outputs',
            );
          } else if (activity.id === oldEdge.target) {
            updatedActivity = removeConnection(
              updatedActivity,
              oldEdge.target,
              oldInputValue,
              'inputs',
            );
          }

          return updatedActivity;
        });

        const outputValue = targetActivity.activityName || targetActivity.id;
        const inputValue = sourceActivity.activityName || sourceActivity.id;

        updatedActivities = updatedActivities.map((activity) => {
          if (activity.id === newConnection.source) {
            return addConnection(
              activity,
              newConnection.source,
              outputValue,
              'outputs',
            );
          }
          if (activity.id === newConnection.target) {
            return addConnection(
              activity,
              newConnection.target,
              inputValue,
              'inputs',
            );
          }
          return activity;
        });

        setActivities(updatedActivities);
      }
    }

    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  };

  const onReconnectEnd = (_: MouseEvent | TouchEvent, edge: Edge): void => {
    if (!edgeReconnectSuccessful.current) {
      const edgeToDelete = findEdgeById(edge.id, edges);
      if (!edgeToDelete) {
        return;
      }

      const { source, target } = edgeToDelete;
      const sourceActivity = findActivityById(source, activities);
      const targetActivity = findActivityById(target, activities);

      if (!(sourceActivity && targetActivity)) {
        return;
      }

      const outputValue = targetActivity.activityName || targetActivity.id;
      const inputValue = sourceActivity.activityName || sourceActivity.id;

      const updatedActivities = activities.map((activity) => {
        const updatedSource = removeConnection(
          activity,
          source,
          outputValue,
          'outputs',
        );
        if (updatedSource !== activity) {
          return updatedSource;
        }

        return removeConnection(activity, target, inputValue, 'inputs');
      });

      setActivities(updatedActivities);

      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeReconnectSuccessful.current = true;
  };

  useEffect(() => {
    setNodes(calculateNodePositions(activities));
    setEdges(generateEdgesFromActivities(activities));
  }, [activities, setNodes, setEdges]);

  return (
    <div className="visual-process-flow-container" ref={reactFlowWrapper}>
      {contextHolder}
      <div className="flow-container" onDragOver={onDragOver} onDrop={onDrop}>
        {activities.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStop={onNodeDragStop}
            onReconnectStart={onReconnectStart}
            onReconnect={onReconnect}
            onReconnectEnd={onReconnectEnd}
            fitView
          >
            <Background bgColor="white" size={4} color="#f0f0f0" />
            <MiniMap
              nodeStrokeColor={(n: Node) => (n.selected ? '#1677ff' : '#555')}
              nodeColor={(n: Node): string => {
                return n.data?.color ? String(n.data.color) : '#eee';
              }}
              nodeBorderRadius={2}
            />
            <Controls />

            <Panel position="top-right" className="control-panel">
              <Space>
                <Tooltip title="Edit selected node">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditNode}
                    disabled={!selectedNode}
                    size="large"
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Delete selected node">
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteNode}
                    disabled={!selectedNode}
                    size="large"
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Space>
            </Panel>
          </ReactFlow>
        ) : (
          <EmptyFlowMessage />
        )}
      </div>
    </div>
  );
};
