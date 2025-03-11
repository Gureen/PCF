import type { Activity } from '@/interfaces';
import type { Edge } from '@xyflow/react';

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
