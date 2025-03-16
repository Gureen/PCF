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
import type { MessageInstance } from 'antd/es/message/interface';
import { EmptyFlowMessage } from './EmptyFlowMessage';
import { calculateNodePositions } from './nodeUtils';
import { edgeTypes, nodeTypes } from './types';
import { generateEdgesFromActivities } from './utils';

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

  const detectCircularDependencies = (
    nodes: { id: string }[],
    edges: Edge[],
  ) => {
    const adjacencyList: { [key: string]: string[] } = {};

    // Build adjacency list from edges
    for (const edge of edges) {
      if (!adjacencyList[edge.source]) {
        adjacencyList[edge.source] = [];
      }
      adjacencyList[edge.source].push(edge.target);
    }

    // Track visited nodes and recursion stack
    const visited: { [key: string]: boolean } = {};
    const recStack: { [key: string]: boolean } = {};

    // Split the cycle detection into smaller functions
    const checkNeighbor = (neighbor: string): boolean => {
      // If neighbor is in recursion stack, we found a cycle
      if (recStack[neighbor]) {
        return true;
      }

      // If neighbor is not visited, check if it leads to a cycle
      if (!visited[neighbor]) {
        return hasCycle(neighbor);
      }

      return false;
    };

    const hasCycle = (nodeId: string): boolean => {
      // Mark current node as visited and part of recursion stack
      visited[nodeId] = true;
      recStack[nodeId] = true;

      // Check all neighbors
      const neighbors = adjacencyList[nodeId] || [];
      for (const neighbor of neighbors) {
        if (checkNeighbor(neighbor)) {
          return true;
        }
      }

      // Remove node from recursion stack and return no cycle
      recStack[nodeId] = false;
      return false;
    };

    // Check each unvisited node
    for (const node of nodes) {
      // Skip visited nodes
      if (visited[node.id]) {
        continue;
      }

      // If cycle is found, return true
      if (hasCycle(node.id)) {
        return true;
      }
    }

    return false;
  };

  // Helper function to find an edge by ID
  const findEdgeById = (
    edgeId: string,
    edgesList: Edge[],
  ): Edge | undefined => {
    return edgesList.find((edge) => edge.id === edgeId);
  };

  // Helper function to find an activity by ID
  const findActivityById = (
    activityId: string,
    activitiesList: Activity[],
  ): Activity | undefined => {
    return activitiesList.find((activity) => activity.id === activityId);
  };

  // Helper function to remove connections from an activity
  const removeConnection = (
    activity: Activity,
    activityId: string,
    valueToRemove: string,
    connectionType: 'inputs' | 'outputs',
  ): Activity => {
    if (activity.id !== activityId) {
      return activity;
    }

    const connections = activity[connectionType] || [];
    return {
      ...activity,
      [connectionType]: connections.filter((item) => item !== valueToRemove),
    };
  };

  // Main edge change handler
  const handleEdgesChange = (changes: EdgeChange[]): void => {
    // Process edge removals to update activities
    const removals = changes.filter((change) => change.type === 'remove');

    if (removals.length === 0) {
      // No removals, just call the original handler
      onEdgesChange(changes);
      return;
    }

    let shouldUpdateActivities = false;
    let updatedActivities = [...activities];

    // Process each edge removal
    for (const removal of removals) {
      const edgeToRemove = findEdgeById(removal.id, edges);
      if (!edgeToRemove) {
        continue;
      }

      const { source, target } = edgeToRemove;
      const sourceActivity = findActivityById(source, activities);
      const targetActivity = findActivityById(target, activities);

      if (!(sourceActivity && targetActivity)) {
        continue;
      }

      shouldUpdateActivities = true;
      const outputValue = targetActivity.activityName || targetActivity.id;
      const inputValue = sourceActivity.activityName || sourceActivity.id;

      // Update activities by removing connections
      updatedActivities = updatedActivities.map((activity) => {
        // Check if this is the source activity
        const updatedSource = removeConnection(
          activity,
          source,
          outputValue,
          'outputs',
        );
        if (updatedSource !== activity) {
          return updatedSource;
        }

        // Check if this is the target activity
        return removeConnection(activity, target, inputValue, 'inputs');
      });
    }

    // Update activities in context if needed
    if (shouldUpdateActivities) {
      setActivities(updatedActivities);
    }

    // Call the original edge change handler
    onEdgesChange(changes);
  };

  // Helper function to validate connection limits
  const validateConnectionLimits = (
    sourceActivity: Activity,
    targetActivity: Activity,
    messageApi: MessageInstance,
  ): boolean => {
    // Validate maximum connections for source node (outputs)
    const currentSourceOutputs = sourceActivity.outputs || [];
    if (currentSourceOutputs.length >= 3) {
      messageApi.error({
        content: `'${sourceActivity.activityName || sourceActivity.id}' already has the maximum of 3 output connections`,
        duration: 4,
      });
      return false;
    }

    // Validate maximum connections for target node (inputs)
    const currentTargetInputs = targetActivity.inputs || [];
    if (currentTargetInputs.length >= 3) {
      messageApi.error({
        content: `'${targetActivity.activityName || targetActivity.id}' already has the maximum of 3 input connections`,
        duration: 4,
      });
      return false;
    }

    return true;
  };

  // Helper function to add connection to an activity
  const addConnection = (
    activity: Activity,
    activityId: string,
    value: string,
    type: 'inputs' | 'outputs',
  ): Activity => {
    if (activity.id !== activityId) {
      return activity;
    }

    const connections = activity[type] || [];
    if (connections.includes(value)) {
      return activity;
    }

    return {
      ...activity,
      [type]: [...connections, value],
    };
  };

  // Main connection handler
  const onConnect = (connection: Connection): void => {
    const newEdge = {
      id: `e-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
    };

    const tempEdges = [...edges, newEdge];
    const nodes = activities.map((activity) => ({ id: activity.id }));

    // Check for circular dependencies
    if (detectCircularDependencies(nodes, tempEdges)) {
      messageApi.error({
        content: 'Cannot create circular dependency in the flow',
        duration: 4,
      });
      return;
    }

    // Find the source and target activities
    const sourceActivity = activities.find(
      (activity) => activity.id === connection.source,
    );
    const targetActivity = activities.find(
      (activity) => activity.id === connection.target,
    );

    if (!(sourceActivity && targetActivity)) {
      return;
    }

    // Validate connection limits
    if (!validateConnectionLimits(sourceActivity, targetActivity, messageApi)) {
      return;
    }

    // If all validations pass, add the edge
    setEdges((eds) => addEdge(connection, eds));

    // Prepare values for connections
    const outputValue = targetActivity.activityName || targetActivity.id;
    const inputValue = sourceActivity.activityName || sourceActivity.id;

    // Update activities with connections
    const updatedActivities = activities.map((activity) => {
      // Try to update source activity
      const withOutput = addConnection(
        activity,
        sourceActivity.id,
        outputValue,
        'outputs',
      );
      if (withOutput !== activity) {
        return withOutput;
      }

      // Try to update target activity
      return addConnection(activity, targetActivity.id, inputValue, 'inputs');
    });

    // Update activities in the context
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

  const onNodeDragStop: NodeMouseHandler = (_, node) => {
    // When a node stops being dragged, update its position in the activities state
    const updatedActivities = activities.map((activity) => {
      if (activity.id === node.id) {
        return {
          ...activity,
          position: {
            x: node.position.x,
            y: node.position.y,
          },
        };
      }
      return activity;
    });

    // Update the activities in the context
    setActivities(updatedActivities);
  };

  // Modify the handleNodesChange function to handle position changes
  const handleNodesChange = (changes: NodeChange[]) => {
    // First, let the React Flow hook handle the visual changes
    onNodesChange(changes);
  };

  // Add these to your VisualProcessFlow component
  const edgeReconnectSuccessful = useRef(true);

  // Add these handler functions to your component
  const onReconnectStart = (): void => {
    edgeReconnectSuccessful.current = false;
  };

  const onReconnect = (oldEdge: Edge, newConnection: Connection): void => {
    edgeReconnectSuccessful.current = true;

    // Find the source and target activities
    const sourceActivity = activities.find(
      (activity) => activity.id === newConnection.source,
    );
    const targetActivity = activities.find(
      (activity) => activity.id === newConnection.target,
    );

    // Only proceed if both activities exist
    if (sourceActivity && targetActivity) {
      // Find the old source and target activities
      const oldSourceActivity = activities.find(
        (activity) => activity.id === oldEdge.source,
      );
      const oldTargetActivity = activities.find(
        (activity) => activity.id === oldEdge.target,
      );

      if (oldSourceActivity && oldTargetActivity) {
        // Remove old connections
        const oldOutputValue =
          oldTargetActivity.activityName || oldTargetActivity.id;
        const oldInputValue =
          oldSourceActivity.activityName || oldSourceActivity.id;

        // Update activities by removing old connections and adding new ones
        let updatedActivities = activities.map((activity) => {
          // Remove old connections first
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

        // Add new connections
        const outputValue = targetActivity.activityName || targetActivity.id;
        const inputValue = sourceActivity.activityName || sourceActivity.id;

        updatedActivities = updatedActivities.map((activity) => {
          // Add new connections
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

        // Update activities in context
        setActivities(updatedActivities);
      }
    }

    // Update the edges in the state
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  };

  const onReconnectEnd = (_: MouseEvent | TouchEvent, edge: Edge): void => {
    if (!edgeReconnectSuccessful.current) {
      // Edge was dropped in empty space
      // Find the edge to delete
      const edgeToDelete = edges.find((e) => e.id === edge.id);
      if (!edgeToDelete) {
        return;
      }

      const { source, target } = edgeToDelete;
      const sourceActivity = activities.find(
        (activity) => activity.id === source,
      );
      const targetActivity = activities.find(
        (activity) => activity.id === target,
      );

      if (!(sourceActivity && targetActivity)) {
        return;
      }

      // Values used in the connections
      const outputValue = targetActivity.activityName || targetActivity.id;
      const inputValue = sourceActivity.activityName || sourceActivity.id;

      // Update activities by removing connections
      const updatedActivities = activities.map((activity) => {
        // Check if this is the source activity
        const updatedSource = removeConnection(
          activity,
          source,
          outputValue,
          'outputs',
        );
        if (updatedSource !== activity) {
          return updatedSource;
        }

        // Check if this is the target activity
        return removeConnection(activity, target, inputValue, 'inputs');
      });

      // Update activities in context
      setActivities(updatedActivities);

      // Remove the edge from the edges state
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    // Reset the flag
    edgeReconnectSuccessful.current = true;
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
          <EmptyFlowMessage />
        )}
      </div>
    </div>
  );
};
