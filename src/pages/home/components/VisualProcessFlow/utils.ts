import type { Activity } from '@/interfaces';
import type { Edge, Node } from '@xyflow/react';
import { findDisconnectedNodes } from './nodeUtils';
import type { ValidationError, ValidationResult } from './types';

export const validateProcessFlow = (
  activities: Activity[],
  nodes: Node[],
  edges: Edge[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (activities.length === 0) {
    errors.push({
      type: 'error',
      message: 'Process flow must have at least one activity',
    });
    return { isValid: errors.length === 0, errors };
  }

  const disconnectedNodes = findDisconnectedNodes(nodes, edges);
  if (disconnectedNodes.length > 0) {
    errors.push({
      type: 'warning',
      message: `${disconnectedNodes.length} disconnected activities found`,
      nodeIds: disconnectedNodes,
    });
  }

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

const findCycles = (nodeIds: string[], edges: Edge[]): string[][] => {
  const adjacencyList = new Map<string, string[]>();

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

const findInputOutputMismatches = (activities: Activity[]): string[] => {
  const allOutputs = new Set<string>();

  for (const activity of activities) {
    if (activity.outputs) {
      for (const output of activity.outputs) {
        allOutputs.add(output);
      }
    }
  }

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
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.75, stroke: '#EEEEEE' },
    labelStyle: { fill: '#666', fontWeight: 500, fontSize: 12 },
    style: { stroke: '#888', strokeWidth: 2, strokeDasharray: '5,5' },
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

/**
 * Generates edges between activities based on matching inputs and outputs
 */
export const generateEdgesFromActivities = (
  activities: Array<Activity>,
): Edge[] => {
  const edges: Edge[] = [];
  const edgeIdSet = new Set<string>();

  // First create a map of all outputs
  const outputMap = createOutputMap(activities);

  // Then connect inputs to matching outputs
  for (const activity of activities) {
    const activityEdges = createEdgesForActivity(
      activity,
      outputMap,
      edgeIdSet,
    );
    for (const edge of activityEdges) {
      edges.push(edge);
    }
  }

  return edges;
};
