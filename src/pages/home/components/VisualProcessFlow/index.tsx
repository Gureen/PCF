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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import './styles.css';
import { edgeTypes, nodeTypes } from './types';
import { calculateNodePositions, generateEdgesFromActivities } from './utils';

export const VisualProcessFlow = () => {
  const { activities } = useProcessFlow();

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

  const onConnect = useCallback(
    (connection: Connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );

  return (
    <div className="visual-process-flow-container">
      <div className="flow-container">
        {activities.length > 0 ? (
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
        ) : (
          <div className="empty-flow-message">
            Add activities to visualize the process flow
          </div>
        )}
      </div>
    </div>
  );
};
