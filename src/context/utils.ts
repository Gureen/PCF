import type { Activity, SavedFlow } from '@/interfaces';
import dayjs from 'dayjs';

/**
 * Ensures an activity has valid properties by providing defaults for missing values
 *
 * @param activity - The activity to validate and apply defaults to
 * @returns A new activity object with defaults applied for missing properties
 */
export const applyActivityDefaults = (activity: Activity): Activity => {
  return {
    id: activity.id || crypto.randomUUID(),
    activityName: activity.activityName || '',
    description: activity.description || '',
    inputs: activity.inputs || [],
    outputs: activity.outputs || [],
    color: activity.color,
    assignedUsers: activity.assignedUsers || [],
    position: activity.position || undefined,
    deadline: activity.deadline ? dayjs(activity.deadline) : undefined,
    approvalCriteria: activity.approvalCriteria || '',
  };
};

/**
 * Adds a unique ID to an activity if it doesn't already have one
 *
 * @param activity - The activity to add an ID to
 * @returns A new activity object with a guaranteed ID
 */
export const addIdToActivity = (activity: Activity): Activity => {
  const activityWithId = {
    ...activity,
    id: activity.id || crypto.randomUUID(),
  };

  return activityWithId;
};

/**
 * Updates a specific activity in an array of activities
 *
 * @param activities - The array of activities to update
 * @param updatedActivity - The activity with new values to apply
 * @returns A new array with the updated activity
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
 * Creates a new flow with the given data and generates required metadata
 *
 * @param flowData - Partial flow data to use for the new flow
 * @param creationDate - Date string to use for creation timestamp
 * @returns A complete SavedFlow object with ID and timestamps
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
 *
 * @returns Current date formatted as a locale-specific string
 */
export const getCurrentDateString = (): string => {
  const currentDate = new Date().toLocaleDateString();

  return currentDate;
};

/**
 * Compares two arrays of activities to detect changes
 *
 * @param current - The current array of activities
 * @param original - The original array of activities to compare against
 * @returns Boolean indicating if the arrays are different
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
 * Updates an existing flow with new data while preserving its ID and creation date
 *
 * @param existingFlow - The original flow to update
 * @param flowData - New data to apply to the flow
 * @param flowId - ID of the flow to update
 * @returns A new SavedFlow object with updated values and preserved metadata
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
 * Finds a flow by its ID from a collection of flows
 *
 * @param flows - Array of flows to search
 * @param flowId - ID of the flow to find
 * @returns The matching flow or undefined if not found
 */
export const findFlowById = (
  flows: SavedFlow[],
  flowId: string,
): SavedFlow | undefined => {
  const foundFlow = flows.find((flow) => flow.id === flowId);

  return foundFlow;
};

/**
 * Finds a flow by its name from a collection of flows
 *
 * @param flows - Array of flows to search
 * @param name - Name of the flow to find
 * @returns The matching flow or undefined if not found
 */
export const findFlowByName = (
  flows: SavedFlow[],
  name: string,
): SavedFlow | undefined => {
  const foundFlow = flows.find((flow) => flow.projectName === name);

  return foundFlow;
};

/**
 * Prepares flow data for saving by applying defaults to activities and generating metadata
 *
 * @param projectName - Name to use for the flow
 * @param activities - Activities to include in the flow
 * @returns Partial SavedFlow object ready for saving
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
 * Creates a flow data object for saving or updating
 *
 * @param projectName - Name to use for the flow
 * @param activities - Activities to include in the flow
 * @returns Partial SavedFlow object with current timestamp
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
 * Checks if a flow exists in a collection by its ID
 *
 * @param flows - Array of flows to search
 * @param flowId - ID of the flow to check for
 * @returns Boolean indicating if the flow exists
 */
export const isFlowInCollection = (
  flows: SavedFlow[],
  flowId: string,
): boolean => {
  const exists = flows.some((flow) => flow.id === flowId);

  return exists;
};

/**
 * Filters a flow from a collection by its ID
 *
 * @param flows - Array of flows to filter
 * @param flowId - ID of the flow to remove
 * @returns New array without the specified flow
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
 *
 * @returns Object with flags indicating a new flow was created
 */
export const getNewFlowResult = () => ({
  isNew: true,
  isUpdated: false,
});

/**
 * Returns a result object for an updated flow
 *
 * @returns Object with flags indicating a flow was updated
 */
export const getUpdatedFlowResult = () => ({
  isNew: false,
  isUpdated: true,
});

/**
 * Returns a result object for an unchanged flow
 *
 * @returns Object with flags indicating no changes were made
 */
export const getUnchangedFlowResult = () => ({
  isNew: false,
  isUpdated: false,
});
