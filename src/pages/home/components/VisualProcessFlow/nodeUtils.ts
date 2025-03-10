import type { Activity } from '@/interfaces';
import type { Edge, Node } from '@xyflow/react';

export const createNodeFromActivity = (
  activity: Activity,
  position: { x: number; y: number },
): Node => {
  return {
    id: activity.id,
    type: 'default',
    position,
    data: {
      label: activity.activityName || 'Unnamed Activity',
      description: activity.description,
      inputs: activity.inputs,
      outputs: activity.outputs,
    },
    style: {
      backgroundColor: activity.color || '#1677ff',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      minWidth: '150px',
    },
  };
};

export const calculateNodePositions = (
  activities: Array<Activity>,
  gridGap = 200,
  nodesPerRow = 3,
): Node[] => {
  const nodes: Node[] = [];

  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];
    const row = Math.floor(index / nodesPerRow);
    const col = index % nodesPerRow;
    const position = { x: col * gridGap, y: row * gridGap };

    nodes.push(createNodeFromActivity(activity, position));
  }

  return nodes;
};

export const findDisconnectedNodes = (
  nodes: Node[],
  edges: Edge[],
): string[] => {
  const connectedNodes = new Set<string>();

  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }

  return nodes
    .map((node) => node.id)
    .filter((nodeId) => !connectedNodes.has(nodeId));
};
