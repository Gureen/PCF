import type { Activity } from '@/interfaces';
import type { Edge } from '@xyflow/react';

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

      // Only add if this edge ID doesn't already exist
      if (!edgeIdSet.has(edgeId)) {
        edges.push({
          id: edgeId,
          source: sourceActivity.id,
          target: targetActivity.id,
        });
        edgeIdSet.add(edgeId);
      }
    }
  }

  return edges;
};
