import type { Activity } from '@/context';
import type { Edge, Node } from '@xyflow/react';
import { ActivityNodeData } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: 'warning' | 'error';
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}

/**
 * Validates a process flow for common issues
 */
export const validateProcessFlow = (
  activities: Activity[],
  nodes: Node[],
  edges: Edge[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check if we have any activities
  if (activities.length === 0) {
    errors.push({
      type: 'error',
      message: 'Process flow must have at least one activity',
    });
    return { isValid: errors.length === 0, errors };
  }

  // Check for disconnected nodes (no incoming or outgoing connections)
  const disconnectedNodes = findDisconnectedNodes(nodes, edges);
  if (disconnectedNodes.length > 0) {
    errors.push({
      type: 'warning',
      message: `${disconnectedNodes.length} disconnected activities found`,
      nodeIds: disconnectedNodes,
    });
  }

  // Check for circular dependencies
  const cycles = findCycles(
    nodes.map((n) => n.id),
    edges,
  );
  if (cycles.length > 0) {
    errors.push({
      type: 'error',
      message: 'Circular dependencies detected in the process flow',
      nodeIds: cycles.flat(),
    });
  }

  // Check for input/output mismatches
  const mismatches = findInputOutputMismatches(activities);
  if (mismatches.length > 0) {
    errors.push({
      type: 'warning',
      message: 'Input/output connections that are not properly linked',
      nodeIds: mismatches,
    });
  }

  return {
    isValid: errors.filter((e) => e.type === 'error').length === 0,
    errors,
  };
};

/**
 * Find nodes with no connections (isolated)
 */
const findDisconnectedNodes = (nodes: Node[], edges: Edge[]): string[] => {
  const connectedNodes = new Set<string>();

  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }

  return nodes
    .map((node) => node.id)
    .filter((nodeId) => !connectedNodes.has(nodeId));
};

/**
 * Find circular dependencies in the flow
 */
const findCycles = (nodeIds: string[], edges: Edge[]): string[][] => {
  const adjacencyList = new Map<string, string[]>();

  // Build adjacency list
  for (const id of nodeIds) {
    adjacencyList.set(id, []);
  }

  for (const edge of edges) {
    const sourceNeighbors = adjacencyList.get(edge.source) || [];
    sourceNeighbors.push(edge.target);
    adjacencyList.set(edge.source, sourceNeighbors);
  }

  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const dfs = (nodeId: string, path: string[] = []): boolean => {
    if (recursionStack.has(nodeId)) {
      // Found a cycle
      const cycleStartIndex = path.indexOf(nodeId);
      cycles.push(path.slice(cycleStartIndex));
      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor, [...path])) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  // Start DFS from each node
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  return cycles;
};

/**
 * Find activities with inputs that don't match any output
 */
const findInputOutputMismatches = (activities: Activity[]): string[] => {
  const allOutputs = new Set<string>();

  // Collect all outputs
  for (const activity of activities) {
    if (activity.outputs) {
      for (const output of activity.outputs) {
        allOutputs.add(output);
      }
    }
  }

  // Find activities with inputs that don't match any output
  const mismatchedActivities: string[] = [];

  for (const activity of activities) {
    if (activity.inputs && activity.inputs.length > 0) {
      const hasUnmatchedInput = activity.inputs.some(
        (input) => !allOutputs.has(input),
      );
      if (hasUnmatchedInput) {
        mismatchedActivities.push(activity.id);
      }
    }
  }

  return mismatchedActivities;
};


export const calculateNodePositions = (activities: Activity[]): Node[] => {
  if (!activities.length) return [];

  // Map of node IDs to their indices in the array (for calculating depths)
  const activityMap = new Map<string, number>();
  activities.forEach((activity, index) => {
    activityMap.set(activity.id, index);
  });

  // Calculate depth of each node (how many steps from start)
  const calculateDepth = (activityId: string, visited = new Set<string>()): number => {
    if (visited.has(activityId)) return 0; // Avoid cycles
    visited.add(activityId);

    const activity = activities.find(a => a.id === activityId);
    if (!activity || !activity.nextActivities || activity.nextActivities.length === 0) {
      return 0;
    }

    let maxDepth = 0;
    for (const nextId of activity.nextActivities) {
      const depth = calculateDepth(nextId, new Set(visited)) + 1;
      maxDepth = Math.max(maxDepth, depth);
    }
    return maxDepth;
  };

  // Group nodes by depth
  const nodesByDepth = new Map<number, string[]>();
  activities.forEach(activity => {
    const depth = calculateDepth(activity.id);
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(activity.id);
  });

  // Position nodes based on depth and position within depth
  const nodes: Node[] = [];
  const verticalSpacing = 150;
  const horizontalSpacing = 250;

  nodesByDepth.forEach((activityIds, depth) => {
    const yPosition = depth * verticalSpacing + 100;
    const totalWidth = activityIds.length * horizontalSpacing;
    const startX = -totalWidth / 2 + horizontalSpacing / 2;

    activityIds.forEach((id, index) => {
      const activity = activities.find(a => a.id === id)!;
      
      // IMPORTANT: Make sure we're correctly mapping all fields from activity to node data
      nodes.push({
        id,
        // Use the correct node type that matches your registered component
        type: 'position-logger',
        position: { 
          x: startX + index * horizontalSpacing, 
          y: yPosition 
        },
        data: {
          // Map the activity name to the label property
          label: activity.activityName,
          // Make sure to include the description field
          description: activity.description,
          // Include inputs and outputs arrays
          inputs: activity.inputs || [],
          outputs: activity.outputs || [],
          // Include color for styling
          color: activity.color || '#1677ff',
        },
      });
    });
  });

  return nodes;
};
/**
 * Creates a map of output names to activity IDs that produce those outputs
 */
export const createOutputMap = (
  activities: Array<Activity>,
): Map<string, string[]> => {
  const outputMap = new Map<string, string[]>();

  for (const activity of activities) {
    if (!activity.outputs) {
      continue;
    }

    for (const output of activity.outputs) {
      if (!outputMap.has(output)) {
        outputMap.set(output, []);
      }
      outputMap.get(output)?.push(activity.id);
    }
  }

  return outputMap;
};

/**
 * Creates an edge between two activities if it doesn't already exist
 */
export const createEdge = (
  sourceId: string,
  targetId: string,
  label: string,
  edgeIdSet: Set<string>,
): Edge | null => {
  // Avoid self-connections
  if (sourceId === targetId) {
    return null;
  }

  // Ensure unique edges
  const edgeId = `${sourceId}->${targetId}`;
  if (edgeIdSet.has(edgeId)) {
    return null;
  }

  // Create and return the edge
  edgeIdSet.add(edgeId);
  return {
    id: edgeId,
    source: sourceId,
    target: targetId,
    animated: true,
    label,
    labelStyle: { fill: '#888', fontWeight: 700 },
    style: { stroke: '#888' },
  };
};

/**
 * Creates edges for activities with inputs that match outputs from other activities
 */
const createEdgesForActivity = (
  activity: Activity,
  outputMap: Map<string, string[]>,
  edgeIdSet: Set<string>,
): Edge[] => {
  const edges: Edge[] = [];

  if (!activity.inputs) {
    return edges;
  }

  for (const input of activity.inputs) {
    const sourceIds = outputMap.get(input);
    if (!sourceIds) {
      continue;
    }

    for (const sourceId of sourceIds) {
      const edge = createEdge(sourceId, activity.id, input, edgeIdSet);
      if (edge) {
        edges.push(edge);
      }
    }
  }

  return edges;
};

// Generate edges from activities
export const generateEdgesFromActivities = (activities: Activity[]): Edge[] => {
  const edges: Edge[] = [];
  
  activities.forEach(activity => {
    if (activity.nextActivities) {
      activity.nextActivities.forEach(targetId => {
        edges.push({
          id: `${activity.id}-${targetId}`,
          source: activity.id,
          target: targetId,
          type: 'default', // or custom edge type if defined
        });
      });
    }
  });
  
  return edges;
};