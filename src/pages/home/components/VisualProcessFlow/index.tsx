import { useProcessFlow } from '@/context';
import {
  Background,
  type Connection,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';
import { edgeTypes, nodeTypes } from './types';
import { calculateNodePositions, generateEdgesFromActivities } from './utils';
import type { Activity } from '@/context';
import { Button, Tooltip, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const VisualProcessFlow = () => {
  const { activities, addActivity, deleteActivity, editActivity } = useProcessFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // No need for useMemo with React 19's automatic memoization
  const initialNodes = calculateNodePositions(activities);
  const initialEdges = generateEdgesFromActivities(activities);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when activities change
  useEffect(() => {
    setNodes(calculateNodePositions(activities));
    setEdges(generateEdgesFromActivities(activities));
  }, [activities, setNodes, setEdges]);
  
  // Add keyboard event listener for deleting nodes with Delete key
  // and editing nodes with Enter key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedNode) {
        if (event.key === 'Delete') {
          handleDeleteNode();
        } else if (event.key === 'Enter') {
          handleEditNode();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );
  
  // Handle node selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node.id);
  }, []);
  
  // Handle node double-click for editing
  const onNodeDoubleClick = useCallback((_, node) => {
    editActivity(node.id);
  }, [editActivity]);
  
  // Handle node deletion
  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      deleteActivity(selectedNode);
      setSelectedNode(null);
    }
  }, [selectedNode, deleteActivity]);
  
  // Handle node editing
  const handleEditNode = useCallback(() => {
    if (selectedNode) {
      editActivity(selectedNode);
      setSelectedNode(null);
    }
  }, [selectedNode, editActivity]);

  // Handle the drag over event to allow dropping
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle the drop event
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // Get the template data from the drag event
      const jsonData = event.dataTransfer.getData('application/json');
      if (!jsonData) return;

      try {
        const templateActivity = JSON.parse(jsonData) as Activity;
        
        // Generate a unique ID for the new activity
        const newActivity: Activity = {
          ...templateActivity,
          id: `activity-${Date.now()}`, // Generate a unique ID
        };

        // Add the new activity to the context
        addActivity(newActivity);
      } catch (error) {
        console.error('Error dropping activity template:', error);
      }
    },
    [addActivity],
  );

  return (
    <div 
      className="visual-process-flow-container"
      ref={reactFlowWrapper}
    >
      <div 
        className="flow-container"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
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
            
            {/* Control panel for node operations */}
            <Panel position="top-right" className="control-panel">
              <Space>
                <Tooltip title="Edit selected node">
                  <Button 
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditNode}
                    disabled={!selectedNode}
                    size="small"
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
                    size="small"
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Space>
            </Panel>
          </ReactFlow>
        ) : (
          <div className="empty-flow-message">
            Drag and drop activity templates here to start building your process flow
          </div>
        )}
      </div>
    </div>
  );
};