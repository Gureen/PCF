import type { Activity } from '@/interfaces';
import type { Edge, Node } from '@xyflow/react';

export const createNodeFromActivity = (
  activity: Activity,
  position: { x: number; y: number },
): Node => {
  return {
    id: activity.id,
    type: 'position-logger',
    position,
    data: {
      label: activity.activityName || 'Unnamed Activity',
      description: activity.description,
      inputs: activity.inputs,
      outputs: activity.outputs,
      assignedUsers: activity.assignedUsers,
      color: activity.color || '#1677ff',
    },
    style: {
      backgroundColor: 'white',
      color: 'black',
      padding: '10px',
      borderRadius: '5px',
      minWidth: '150px',
    },
  };
};

// Build a dependency graph from activities based on input/output relationships
const buildDependencyGraph = (
  activities: Activity[],
): Map<string, string[]> => {
  // Step 1: Initialize the graph and output map
  const outputMap = new Map<string, string[]>();
  const dependencyGraph = new Map<string, string[]>();

  // Initialize dependency graph with empty arrays
  for (const activity of activities) {
    dependencyGraph.set(activity.id, []);
  }

  // Step 2: Map outputs to their source activities
  mapOutputsToSources(activities, outputMap);

  // Step 3: Build dependency connections
  buildConnections(activities, outputMap, dependencyGraph);

  return dependencyGraph;
};

// Helper function to map outputs to their source activities
const mapOutputsToSources = (
  activities: Activity[],
  outputMap: Map<string, string[]>,
): void => {
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
};

// Helper function to build dependency connections
const buildConnections = (
  activities: Activity[],
  outputMap: Map<string, string[]>,
  dependencyGraph: Map<string, string[]>,
): void => {
  for (const activity of activities) {
    if (!activity.inputs) {
      continue;
    }

    for (const input of activity.inputs) {
      const sourceActivities = outputMap.get(input);
      if (!sourceActivities) {
        continue;
      }

      addDependencies(activity.id, sourceActivities, dependencyGraph);
    }
  }
};

// Helper function to add dependencies to the graph
const addDependencies = (
  activityId: string,
  sourceActivities: string[],
  dependencyGraph: Map<string, string[]>,
): void => {
  for (const sourceId of sourceActivities) {
    if (sourceId === activityId) {
      continue; // Avoid self-references
    }

    const dependencies = dependencyGraph.get(activityId) || [];
    if (!dependencies.includes(sourceId)) {
      dependencies.push(sourceId);
      dependencyGraph.set(activityId, dependencies);
    }
  }
};

// Assign levels to nodes based on dependency relationships
const assignNodeLevels = (activities: Activity[]): Map<string, number> => {
  const dependencyGraph = buildDependencyGraph(activities);
  const nodeLevels = new Map<string, number>();

  // Find starting nodes (ones with no dependencies)
  const startNodes = findStartNodes(activities, dependencyGraph);

  // Assign levels starting from level 0 for starting nodes
  for (const nodeId of startNodes) {
    assignLevelDFS(
      nodeId,
      0,
      new Set<string>(),
      nodeLevels,
      dependencyGraph,
      activities,
    );
  }

  return nodeLevels;
};

// Find nodes with no dependencies to use as starting points
const findStartNodes = (
  activities: Activity[],
  dependencyGraph: Map<string, string[]>,
): string[] => {
  const startNodes: string[] = [];

  for (const activity of activities) {
    const deps = dependencyGraph.get(activity.id) || [];
    if (deps.length === 0) {
      startNodes.push(activity.id);
    }
  }

  // If no clear starting nodes, use the first activity
  if (startNodes.length === 0 && activities.length > 0) {
    startNodes.push(activities[0].id);
  }

  return startNodes;
};

// DFS function to assign levels
const assignLevelDFS = (
  nodeId: string,
  level: number,
  visited: Set<string>,
  nodeLevels: Map<string, number>,
  dependencyGraph: Map<string, string[]>,
  activities: Activity[],
): void => {
  if (visited.has(nodeId)) {
    return;
  }
  visited.add(nodeId);

  // Update level to max of current or new level
  const currentLevel = nodeLevels.get(nodeId) || 0;
  nodeLevels.set(nodeId, Math.max(currentLevel, level));

  // Process dependencies (they should be one level higher)
  processDependencies(
    nodeId,
    level,
    visited,
    nodeLevels,
    dependencyGraph,
    activities,
  );

  // Process dependents (they should be one level lower)
  processDependents(
    nodeId,
    level,
    visited,
    nodeLevels,
    dependencyGraph,
    activities,
  );
};

// Process dependencies (nodes that the current node depends on)
const processDependencies = (
  nodeId: string,
  level: number,
  visited: Set<string>,
  nodeLevels: Map<string, number>,
  dependencyGraph: Map<string, string[]>,
  activities: Activity[],
): void => {
  for (const depId of dependencyGraph.get(nodeId) || []) {
    assignLevelDFS(
      depId,
      level - 1,
      visited,
      nodeLevels,
      dependencyGraph,
      activities,
    );
  }
};

// Process dependents (nodes that depend on the current node)
const processDependents = (
  nodeId: string,
  level: number,
  visited: Set<string>,
  nodeLevels: Map<string, number>,
  dependencyGraph: Map<string, string[]>,
  activities: Activity[],
): void => {
  for (const activity of activities) {
    const deps = dependencyGraph.get(activity.id) || [];
    if (deps.includes(nodeId)) {
      assignLevelDFS(
        activity.id,
        level + 1,
        visited,
        nodeLevels,
        dependencyGraph,
        activities,
      );
    }
  }
};

// Group nodes by level for horizontal layout
const groupNodesByLevel = (activities: Activity[]): Map<number, string[]> => {
  const nodeLevels = assignNodeLevels(activities);
  const levelGroups = new Map<number, string[]>();

  // Group node IDs by their level
  for (const [nodeId, level] of nodeLevels.entries()) {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)?.push(nodeId);
  }

  return levelGroups;
};

export const calculateNodePositions = (
  activities: Array<Activity>,
  horizontalGap = 250,
  verticalGap = 150,
): Node[] => {
  if (activities.length === 0) {
    return [];
  }

  const levelGroups = groupNodesByLevel(activities);
  const nodes: Node[] = [];

  // Sort level groups by level number for top-down layout
  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);

  // Calculate positions for each node based on its level and position within level
  for (const level of sortedLevels) {
    const nodesInLevel = levelGroups.get(level) || [];

    // Calculate total width needed for this level
    const levelWidth = nodesInLevel.length * horizontalGap;
    const startX = -levelWidth / 2 + horizontalGap / 2;

    for (let nodeIndex = 0; nodeIndex < nodesInLevel.length; nodeIndex++) {
      const nodeId = nodesInLevel[nodeIndex];
      const activity = activities.find((a) => a.id === nodeId);
      if (!activity) {
        continue;
      }

      const x = startX + nodeIndex * horizontalGap;
      const y = level * verticalGap;

      nodes.push(createNodeFromActivity(activity, { x, y }));
    }
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

  const disconnectedNodes: string[] = [];
  for (const node of nodes) {
    if (!connectedNodes.has(node.id)) {
      disconnectedNodes.push(node.id);
    }
  }

  return disconnectedNodes;
};
