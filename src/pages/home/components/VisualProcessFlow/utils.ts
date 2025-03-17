import type { Activity } from '@/interfaces';
import { type Edge, MarkerType, type Node } from '@xyflow/react';
import type { MessageInstance } from 'antd/es/message/interface';

/**
 * Creates a node from an activity with optional position
 * @param activity Activity to convert to a node
 * @param position Optional position for the node
 * @returns Node object for React Flow
 */
export const createNodeFromActivity = (
  activity: Activity,
  position?: { x: number; y: number },
): Node => {
  const nodePosition = activity.position || position || { x: 0, y: 0 };

  return {
    id: activity.id,
    type: 'position-logger',
    position: nodePosition,
    data: {
      label: activity.activityName || 'Unnamed Activity',
      description: activity.description,
      inputs: activity.inputs,
      outputs: activity.outputs,
      assignedUsers: activity.assignedUsers,
      color: activity.color,
      deadline: activity.deadline,
      approvalCriteria: activity.approvalCriteria,
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

/**
 * Builds a dependency graph from activities based on input/output relationships
 * @param activities Array of activities to analyze
 * @returns Map with node IDs as keys and arrays of dependent node IDs as values
 */
const buildDependencyGraph = (
  activities: Activity[],
): Map<string, string[]> => {
  const outputMap = new Map<string, string[]>();
  const dependencyGraph = new Map<string, string[]>();

  for (const activity of activities) {
    dependencyGraph.set(activity.id, []);
  }

  mapOutputsToSources(activities, outputMap);
  buildConnections(activities, outputMap, dependencyGraph);

  return dependencyGraph;
};

/**
 * Maps outputs to their source activities
 * @param activities Array of activities to analyze
 * @param outputMap Map to populate with output-to-source mappings
 */
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

/**
 * Builds dependency connections between activities
 * @param activities Array of activities
 * @param outputMap Map of outputs to source activities
 * @param dependencyGraph Graph to populate with dependencies
 */
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

/**
 * Adds dependencies to the dependency graph
 * @param activityId ID of the activity to add dependencies for
 * @param sourceActivities Array of source activity IDs
 * @param dependencyGraph Graph to update with new dependencies
 */
const addDependencies = (
  activityId: string,
  sourceActivities: string[],
  dependencyGraph: Map<string, string[]>,
): void => {
  for (const sourceId of sourceActivities) {
    if (sourceId === activityId) {
      continue;
    }

    const dependencies = dependencyGraph.get(activityId) || [];
    if (!dependencies.includes(sourceId)) {
      dependencies.push(sourceId);
      dependencyGraph.set(activityId, dependencies);
    }
  }
};

/**
 * Assigns levels to nodes based on dependency relationships
 * @param activities Array of activities to assign levels to
 * @returns Map of node IDs to their calculated level
 */
const assignNodeLevels = (activities: Activity[]): Map<string, number> => {
  const dependencyGraph = buildDependencyGraph(activities);
  const nodeLevels = new Map<string, number>();
  const startNodes = findStartNodes(activities, dependencyGraph);

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

/**
 * Finds nodes with no dependencies to use as starting points
 * @param activities Array of activities
 * @param dependencyGraph Dependency graph
 * @returns Array of node IDs that have no dependencies
 */
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

  if (startNodes.length === 0 && activities.length > 0) {
    startNodes.push(activities[0].id);
  }

  return startNodes;
};

/**
 * Assigns levels to nodes using depth-first search
 * @param nodeId Current node ID
 * @param level Current level
 * @param visited Set of visited nodes
 * @param nodeLevels Map to store node levels
 * @param dependencyGraph Dependency graph
 * @param activities Array of activities
 */
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

  const currentLevel = nodeLevels.get(nodeId) || 0;
  nodeLevels.set(nodeId, Math.max(currentLevel, level));

  processDependencies(
    nodeId,
    level,
    visited,
    nodeLevels,
    dependencyGraph,
    activities,
  );

  processDependents(
    nodeId,
    level,
    visited,
    nodeLevels,
    dependencyGraph,
    activities,
  );
};

/**
 * Processes dependencies (nodes that the current node depends on)
 * @param nodeId Current node ID
 * @param level Current level
 * @param visited Set of visited nodes
 * @param nodeLevels Map to store node levels
 * @param dependencyGraph Dependency graph
 * @param activities Array of activities
 */
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

/**
 * Processes dependents (nodes that depend on the current node)
 * @param nodeId Current node ID
 * @param level Current level
 * @param visited Set of visited nodes
 * @param nodeLevels Map to store node levels
 * @param dependencyGraph Dependency graph
 * @param activities Array of activities
 */
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

/**
 * Groups nodes by level for horizontal layout
 * @param activities Array of activities
 * @returns Map of levels to arrays of node IDs
 */
const groupNodesByLevel = (activities: Activity[]): Map<number, string[]> => {
  const nodeLevels = assignNodeLevels(activities);
  const levelGroups = new Map<number, string[]>();

  for (const [nodeId, level] of nodeLevels.entries()) {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)?.push(nodeId);
  }

  return levelGroups;
};

/**
 * Creates nodes using saved positions
 * @param activities Array of activities with saved positions
 * @returns Array of nodes with positions
 */
const createNodesFromSavedPositions = (activities: Activity[]): Node[] => {
  return activities.map((activity) =>
    createNodeFromActivity(activity, activity.position),
  );
};

/**
 * Creates nodes for a specific level
 * @param level Level number
 * @param nodesInLevel Array of node IDs in this level
 * @param activities Array of all activities
 * @param horizontalGap Gap between nodes horizontally
 * @param verticalGap Gap between levels vertically
 * @returns Array of nodes with calculated positions
 */
const createNodesForLevel = (
  level: number,
  nodesInLevel: string[],
  activities: Activity[],
  horizontalGap: number,
  verticalGap: number,
): Node[] => {
  const nodes: Node[] = [];
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

  return nodes;
};

/**
 * Calculates positions for nodes without saved positions
 * @param activities Array of activities
 * @param horizontalGap Gap between nodes horizontally
 * @param verticalGap Gap between levels vertically
 * @returns Array of nodes with calculated positions
 */
const calculateLayoutPositions = (
  activities: Activity[],
  horizontalGap: number,
  verticalGap: number,
): Node[] => {
  const levelGroups = groupNodesByLevel(activities);
  const nodes: Node[] = [];
  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);

  for (const level of sortedLevels) {
    const nodesInLevel = levelGroups.get(level) || [];
    const nodesForThisLevel = createNodesForLevel(
      level,
      nodesInLevel,
      activities,
      horizontalGap,
      verticalGap,
    );

    nodes.push(...nodesForThisLevel);
  }

  return nodes;
};

/**
 * Handles mixed case - some nodes with positions, some without
 * @param activitiesWithPositions Activities that have positions
 * @param activitiesNeedingPositions Activities that need positions calculated
 * @param horizontalGap Gap between nodes horizontally
 * @param verticalGap Gap between levels vertically
 * @returns Array of nodes with positions
 */
const handleMixedPositions = (
  activitiesWithPositions: Activity[],
  activitiesNeedingPositions: Activity[],
  horizontalGap: number,
  verticalGap: number,
): Node[] => {
  const savedNodes = createNodesFromSavedPositions(activitiesWithPositions);
  const calculatedNodes = calculateLayoutPositions(
    activitiesNeedingPositions,
    horizontalGap,
    verticalGap,
  );

  return [...savedNodes, ...calculatedNodes];
};

/**
 * Calculates positions for nodes in a flow diagram
 * @param activities Array of activities to position
 * @param horizontalGap Gap between nodes horizontally (default: 250)
 * @param verticalGap Gap between levels vertically (default: 150)
 * @returns Array of nodes with calculated positions
 */
export const calculateNodePositions = (
  activities: Array<Activity>,
  horizontalGap = 250,
  verticalGap = 150,
): Node[] => {
  if (activities.length === 0) {
    return [];
  }

  const allHavePositions = activities.every((activity) => !!activity.position);

  if (allHavePositions) {
    return createNodesFromSavedPositions(activities);
  }

  const activitiesWithPositions = activities.filter((a) => !!a.position);
  const activitiesNeedingPositions = activities.filter((a) => !a.position);

  if (
    activitiesWithPositions.length > 0 &&
    activitiesNeedingPositions.length > 0
  ) {
    return handleMixedPositions(
      activitiesWithPositions,
      activitiesNeedingPositions,
      horizontalGap,
      verticalGap,
    );
  }

  return calculateLayoutPositions(activities, horizontalGap, verticalGap);
};

/**
 * Finds nodes that have no connections to any other nodes
 * @param nodes Array of all nodes
 * @param edges Array of all edges
 * @returns Array of disconnected node IDs
 */
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

/**
 * Generates edges based on activities' input/output relationships
 * @param activities Array of activities to generate edges from
 * @returns Array of edges for React Flow
 */
export const generateEdgesFromActivities = (
  activities: Array<Activity>,
): Edge[] => {
  const edges: Edge[] = [];
  const edgeIdSet = new Set<string>();

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

/**
 * Detects circular dependencies in a flow graph
 * @param nodes Array of node objects with ids
 * @param edges Array of edge objects
 * @returns Boolean indicating whether a circular dependency exists
 */
export const detectCircularDependencies = (
  nodes: { id: string }[],
  edges: Edge[],
): boolean => {
  const adjacencyList: { [key: string]: string[] } = {};

  for (const edge of edges) {
    if (!adjacencyList[edge.source]) {
      adjacencyList[edge.source] = [];
    }
    adjacencyList[edge.source].push(edge.target);
  }

  const visited: { [key: string]: boolean } = {};
  const recStack: { [key: string]: boolean } = {};

  const checkNeighbor = (neighbor: string): boolean => {
    if (recStack[neighbor]) {
      return true;
    }

    if (!visited[neighbor]) {
      return hasCycle(neighbor);
    }

    return false;
  };

  const hasCycle = (nodeId: string): boolean => {
    visited[nodeId] = true;
    recStack[nodeId] = true;

    const neighbors = adjacencyList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (checkNeighbor(neighbor)) {
        return true;
      }
    }

    recStack[nodeId] = false;
    return false;
  };

  for (const node of nodes) {
    if (visited[node.id]) {
      continue;
    }

    if (hasCycle(node.id)) {
      return true;
    }
  }

  return false;
};

/**
 * Finds an edge by ID in an array of edges
 * @param edgeId ID of the edge to find
 * @param edgesList Array of edges to search
 * @returns The found edge or undefined
 */
export const findEdgeById = (
  edgeId: string,
  edgesList: Edge[],
): Edge | undefined => {
  return edgesList.find((edge) => edge.id === edgeId);
};

/**
 * Finds an activity by ID in an array of activities
 * @param activityId ID of the activity to find
 * @param activitiesList Array of activities to search
 * @returns The found activity or undefined
 */
export const findActivityById = (
  activityId: string,
  activitiesList: Activity[],
): Activity | undefined => {
  return activitiesList.find((activity) => activity.id === activityId);
};

/**
 * Removes a connection from an activity
 * @param activity The activity to modify
 * @param activityId ID of the activity to check
 * @param valueToRemove Value to remove from connections
 * @param connectionType Type of connection ('inputs' or 'outputs')
 * @returns Updated activity
 */
export const removeConnection = (
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

/**
 * Adds a connection to an activity
 * @param activity The activity to modify
 * @param activityId ID of the activity to check
 * @param value Value to add to connections
 * @param type Type of connection ('inputs' or 'outputs')
 * @returns Updated activity
 */
export const addConnection = (
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

/**
 * Validates connection limits for source and target activities
 * @param sourceActivity Source activity
 * @param targetActivity Target activity
 * @param messageApi Ant Design message API instance
 * @returns Boolean indicating whether connection is valid
 */
export const validateConnectionLimits = (
  sourceActivity: Activity,
  targetActivity: Activity,
  messageApi: MessageInstance,
): boolean => {
  const currentSourceOutputs = sourceActivity.outputs || [];
  if (currentSourceOutputs.length >= 3) {
    messageApi.error({
      content: `'${sourceActivity.activityName || sourceActivity.id}' already has the maximum of 3 output connections`,
      duration: 4,
    });
    return false;
  }

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

/**
 * Updates an activity's position in the activities array
 * @param activities Array of activities
 * @param nodeId ID of the node that was moved
 * @param position New position coordinates
 * @returns Updated activities array
 */
export const updateActivityPosition = (
  activities: Activity[],
  nodeId: string,
  position: { x: number; y: number },
): Activity[] => {
  return activities.map((activity) => {
    if (activity.id === nodeId) {
      return {
        ...activity,
        position: {
          x: position.x,
          y: position.y,
        },
      };
    }
    return activity;
  });
};

/**
 * Processes edge removal and updates activities accordingly
 * @param changes Edge changes
 * @param edges Current edges
 * @param activities Current activities
 * @returns Object containing updated activities and whether update is needed
 */
export const processEdgeRemovals = (
  changes: { type: string; id: string }[],
  edges: Edge[],
  activities: Activity[],
): { updatedActivities: Activity[]; shouldUpdate: boolean } => {
  let shouldUpdateActivities = false;
  let updatedActivities = [...activities];

  for (const removal of changes) {
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

    updatedActivities = updatedActivities.map((activity) => {
      const updatedSource = removeConnection(
        activity,
        source,
        outputValue,
        'outputs',
      );
      if (updatedSource !== activity) {
        return updatedSource;
      }

      return removeConnection(activity, target, inputValue, 'inputs');
    });
  }

  return { updatedActivities, shouldUpdate: shouldUpdateActivities };
};
