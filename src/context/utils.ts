import type { Activity, SavedFlow } from '@/interfaces';
import { DEFAULT_COLOR } from '@/utils';

/**
 * Ensures activity has valid properties by providing defaults for missing values
 */
export const applyActivityDefaults = (activity: Activity): Activity => {
  const {
    color = DEFAULT_COLOR,
    inputs = [],
    outputs = [],
    assignedUsers = [],
  } = activity;

  const activityWithDefaults = {
    ...activity,
    color,
    inputs,
    outputs,
    assignedUsers,
  };

  return activityWithDefaults;
};

/**
 * Adds an ID to an activity if it doesn't have one
 */
export const addIdToActivity = (activity: Activity): Activity => {
  const activityWithId = {
    ...activity,
    id: activity.id || Date.now().toString(),
  };

  return activityWithId;
};

/**
 * Updates an activity in a list of activities
 */
export const updateActivityInList = (
  activities: Activity[],
  updatedActivity: Activity,
): Activity[] => {
  const updatedActivities = activities.map((a) =>
    a.id === updatedActivity.id ? updatedActivity : a,
  );

  return updatedActivities;
};

/**
 * Creates a new flow with the given data
 */
export const createNewFlow = (
  flowData: Partial<SavedFlow>,
  creationDate: string,
): SavedFlow => {
  const newFlow = {
    ...flowData,
    id: crypto.randomUUID(),
    createdAt: creationDate,
    lastModified: creationDate,
  } as SavedFlow;

  return newFlow;
};

/**
 * Returns the current date as a localized string
 */
export const getCurrentDateString = (): string => {
  const currentDate = new Date().toLocaleDateString();

  return currentDate;
};

/**
 * Compares two arrays of activities to detect changes
 */
export const areActivitiesDifferent = (
  current: Activity[],
  original: Activity[],
): boolean => {
  const currentJson = JSON.stringify(current);
  const originalJson = JSON.stringify(original);
  const hasChanged = currentJson !== originalJson;

  return hasChanged;
};

/**
 * Updates a flow with new data while preserving its ID and creation date
 */
export const updateExistingFlow = (
  existingFlow: SavedFlow,
  flowData: Partial<SavedFlow>,
  flowId: string,
): SavedFlow => {
  const updatedFlow = {
    ...flowData,
    id: flowId,
    createdAt: existingFlow.createdAt,
  } as SavedFlow;

  return updatedFlow;
};

/**
 * Finds a flow by ID from a collection of flows
 */
export const findFlowById = (
  flows: SavedFlow[],
  flowId: string,
): SavedFlow | undefined => {
  const foundFlow = flows.find((flow) => flow.id === flowId);

  return foundFlow;
};

/**
 * Finds a flow by name from a collection of flows
 */
export const findFlowByName = (
  flows: SavedFlow[],
  name: string,
): SavedFlow | undefined => {
  const foundFlow = flows.find((flow) => flow.projectName === name);

  return foundFlow;
};

/**
 * Prepares flow data for saving by applying defaults to activities
 */
export const prepareFlowData = (
  projectName: string,
  activities: Activity[],
): Partial<SavedFlow> => {
  const activitiesWithDefaults = activities.map(applyActivityDefaults);
  const currentDate = getCurrentDateString();

  const flowData = {
    projectName,
    activities: activitiesWithDefaults,
    lastModified: currentDate,
  };

  return flowData;
};

/**
 * Creates flow data object for saving or updating
 */
export const createFlowData = (
  projectName: string,
  activities: Activity[],
): Partial<SavedFlow> => {
  return {
    projectName,
    activities,
    lastModified: getCurrentDateString(),
  };
};

/**
 * Checks if a flow exists in a collection
 */
export const isFlowInCollection = (
  flows: SavedFlow[],
  flowId: string,
): boolean => {
  const exists = flows.some((flow) => flow.id === flowId);

  return exists;
};

/**
 * Filters a flow from a collection
 */
export const filterFlowById = (
  flows: SavedFlow[],
  flowId: string,
): SavedFlow[] => {
  const filteredFlows = flows.filter((flow) => flow.id !== flowId);

  return filteredFlows;
};

/**
 * Returns a result object for a newly created flow
 */
export const getNewFlowResult = () => ({
  isNew: true,
  isUpdated: false,
});

/**
 * Returns a result object for an updated flow
 */
export const getUpdatedFlowResult = () => ({
  isNew: false,
  isUpdated: true,
});

/**
 * Returns a result object for an unchanged flow
 */
export const getUnchangedFlowResult = () => ({
  isNew: false,
  isUpdated: false,
});
