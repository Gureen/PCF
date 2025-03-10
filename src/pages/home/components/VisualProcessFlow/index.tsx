import { useProcessFlow } from '@/context/hooks';
import type { Activity } from '@/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Background,
  type Connection,
  Controls,
  MiniMap,
  type Node,
  type NodeMouseHandler,
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './styles.css';
import { calculateNodePositions } from './nodeUtils';
import { edgeTypes, nodeTypes } from './types';
import { generateEdgesFromActivities } from './utils';

export const VisualProcessFlow = () => {
  const { activities, addActivity, deleteActivity, editActivity } =
    useProcessFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const initialNodes = calculateNodePositions(activities);
  const initialEdges = generateEdgesFromActivities(activities);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection): void => {
    setEdges((edges) => addEdge(connection, edges));
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

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (selectedNode) {
      if (event.key === 'Delete') {
        handleDeleteNode();
      } else if (event.key === 'Enter') {
        handleEditNode();
      }
    }
  };

  const setupKeyboardListeners = (): (() => void) => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
        id: `activity-${Date.now()}`,
      };

      addActivity(newActivity);
    } catch (error) {
      console.error('Error dropping activity template:', error);
    }
  };

  useEffect(() => {
    setNodes(calculateNodePositions(activities));
    setEdges(generateEdgesFromActivities(activities));
  }, [activities, setNodes, setEdges]);

  useEffect(() => {
    const cleanup = setupKeyboardListeners();
    return cleanup;
  }, [selectedNode]);

  return (
    <div className="visual-process-flow-container" ref={reactFlowWrapper}>
      <div className="flow-container" onDragOver={onDragOver} onDrop={onDrop}>
        {activities.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            fitView
          >
            <Background bgColor="white" />
            <MiniMap />
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
          <div className="empty-flow-message">
            Drag and drop activity templates here to start building your process
            flow
          </div>
        )}
      </div>
    </div>
  );
};
