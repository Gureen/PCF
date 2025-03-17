import type { Activity } from '@/interfaces';
import { type Edge, MarkerType } from '@xyflow/react';

// Main function to generate edges
export const generateEdgesFromActivities = (
  activities: Array<Activity>,
): Edge[] => {
  const edges: Edge[] = [];
  const edgeIdSet = new Set<string>();

  // Single-pass approach to create edges based on outputs
  for (const sourceActivity of activities) {
    if (!sourceActivity.outputs || sourceActivity.outputs.length === 0) {
      continue;
    }

    for (const outputTarget of sourceActivity.outputs) {
      const targetActivity = activities.find(
        (activity) =>
          activity.activityName === outputTarget ||
          activity.id === outputTarget,
      );

      if (!targetActivity) {
        continue;
      }

      const edgeId = `e-${sourceActivity.id}-${targetActivity.id}`;

      if (!edgeIdSet.has(edgeId)) {
        edges.push({
          id: edgeId,
          source: sourceActivity.id,
          target: targetActivity.id,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#333333',
            width: 15,
            height: 20,
            strokeWidth: 1,
          },
          style: {
            strokeDasharray: '5, 5',
            strokeWidth: 1.5,
            stroke: '#333333',
          },
        });
        edgeIdSet.add(edgeId);
      }
    }
  }

  return edges;
};
