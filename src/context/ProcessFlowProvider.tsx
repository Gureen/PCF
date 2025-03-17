import { preloadedFlows } from '@/pages/home/components/ProcessFlowContainer/mocks';
import { useEffect, useState } from 'react';

import type { Activity, SavedFlow } from '@/interfaces';
import { ProcessFlowContext } from './ProcessFlowContext';
import type { ProcessFlowProviderProps } from './types';
import {
  addIdToActivity,
  applyActivityDefaults,
  areActivitiesDifferent,
  createFlowData,
  createNewFlow,
  filterFlowById,
  findFlowById,
  findFlowByName,
  getCurrentDateString,
  getNewFlowResult,
  getUnchangedFlowResult,
  getUpdatedFlowResult,
  isFlowInCollection,
  prepareFlowData,
  updateActivityInList,
  updateExistingFlow,
} from './utils';

/**
 * Provider component that implements the ProcessFlow context
 *
 * Manages state and operations for activities, flows, and process management
 * Makes process flow functionality available to all child components
 *
 * @param props - Component props
 * @param props.children - Child components that will have access to the context
 */
export const ProcessFlowProvider = ({ children }: ProcessFlowProviderProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlows, setSavedFlows] = useState<SavedFlow[]>([]);
  const [preloadedFlowsData, setPreloadedFlowsData] = useState<SavedFlow[]>([
    ...preloadedFlows,
  ]);
  const [allFlows, setAllFlows] = useState<SavedFlow[]>([]);
  const [currentFlowName, setCurrentFlowName] = useState<string>('');
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  /**
   * Updates the combined list of all flows (preloaded and user-saved)
   */
  const updateAllFlows = () => {
    setAllFlows([...preloadedFlowsData, ...savedFlows]);
  };

  /**
   * Compares current activities with original state to detect changes
   * Updates hasChanges flag accordingly
   */
  const checkForChanges = () => {
    if (currentFlowId && originalActivities.length > 0) {
      const activitiesChanged = areActivitiesDifferent(
        activities,
        originalActivities,
      );
      setHasChanges(activitiesChanged);
    } else if (activities.length > 0 && !currentFlowId) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  };

  /**
   * Adds a new activity to the current flow
   *
   * @param activity - The activity to add
   */
  const addActivity = (activity: Activity) => {
    const activityWithId = addIdToActivity(activity);
    const activityWithDefaults = applyActivityDefaults(activityWithId);

    setActivities([...activities, activityWithDefaults]);
  };

  /**
   * Selects an activity for editing by its ID
   *
   * @param id - ID of the activity to edit
   */
  const editActivity = (id: string) => {
    const activity = activities.find((a) => a.id === id);

    if (activity) {
      const activityWithDefaults = applyActivityDefaults(activity);
      setCurrentActivity(activityWithDefaults);
      setIsEditing(true);
    }
  };

  /**
   * Updates an existing activity with new values
   * Preserves connections if they exist
   *
   * @param updatedActivity - Activity with updated values
   */
  const updateActivity = (updatedActivity: Activity) => {
    const existingActivity = activities.find(
      (a) => a.id === updatedActivity.id,
    );

    const activityWithConnections = {
      ...updatedActivity,
      inputs: existingActivity?.inputs || updatedActivity.inputs || [],
      outputs: existingActivity?.outputs || updatedActivity.outputs || [],
    };

    const activityWithDefaults = applyActivityDefaults(activityWithConnections);
    const updatedActivities = updateActivityInList(
      activities,
      activityWithDefaults,
    );

    setActivities(updatedActivities);
    setCurrentActivity(null);
    setIsEditing(false);
  };

  /**
   * Removes an activity from the current flow
   *
   * @param id - ID of the activity to delete
   */
  const deleteActivity = (id: string) => {
    const filteredActivities = activities.filter((a) => a.id !== id);
    setActivities(filteredActivities);
  };

  /**
   * Removes all activities from the current flow and resets state
   */
  const clearActivities = () => {
    setActivities([]);
    setOriginalActivities([]);
    setHasChanges(false);
  };

  /**
   * Cancels the current activity editing operation
   */
  const cancelEditing = () => {
    setCurrentActivity(null);
    setIsEditing(false);
  };

  /**
   * Creates and saves a new flow with the provided data
   *
   * @param flowData - Data for the new flow
   * @param currentDate - Current date for timestamps
   * @returns Object indicating a new flow was created
   */
  const saveNewFlow = (flowData: Partial<SavedFlow>, currentDate: string) => {
    const newFlow = createNewFlow(flowData, currentDate);
    setSavedFlows([...savedFlows, newFlow]);
    setCurrentFlowId(newFlow.id);

    return getNewFlowResult();
  };

  /**
   * Updates a preloaded flow with new data
   *
   * @param existingFlow - Original flow to update
   * @param flowData - New data to apply
   * @returns Object indicating if the flow was updated
   */
  const updatePreloadedFlow = (
    existingFlow: SavedFlow,
    flowData: Partial<SavedFlow>,
  ) => {
    if (!currentFlowId) {
      return getUnchangedFlowResult();
    }

    const updatedFlow = updateExistingFlow(
      existingFlow,
      flowData,
      currentFlowId,
    );
    const updatedFlows = preloadedFlowsData.map((flow) =>
      flow.id === currentFlowId ? updatedFlow : flow,
    );

    setPreloadedFlowsData(updatedFlows);

    return getUpdatedFlowResult();
  };

  /**
   * Updates a user-saved flow with new data
   *
   * @param existingFlow - Original flow to update
   * @param flowData - New data to apply
   * @returns Object indicating if the flow was updated
   */
  const updateSavedFlow = (
    existingFlow: SavedFlow,
    flowData: Partial<SavedFlow>,
  ) => {
    if (!currentFlowId) {
      return getUnchangedFlowResult();
    }

    const updatedFlow = updateExistingFlow(
      existingFlow,
      flowData,
      currentFlowId,
    );
    const updatedFlows = savedFlows.map((flow) =>
      flow.id === currentFlowId ? updatedFlow : flow,
    );

    setSavedFlows(updatedFlows);

    return getUpdatedFlowResult();
  };

  /**
   * Saves the current flow with the provided name
   * Creates a new flow or updates existing one based on current state
   *
   * @param projectFlowName - Name to save the flow under
   * @returns Object indicating if the flow is new or was updated
   */
  const saveFlow = (projectFlowName: string) => {
    const flowData = prepareFlowData(projectFlowName, activities);
    const currentDate = getCurrentDateString();
    let result: ReturnType<
      | typeof getNewFlowResult
      | typeof getUnchangedFlowResult
      | typeof getUpdatedFlowResult
    >;

    if (!currentFlowId) {
      result = saveNewFlow(flowData, currentDate);
    } else {
      const preloadedFlow = findFlowById(preloadedFlowsData, currentFlowId);
      const savedFlow = findFlowById(savedFlows, currentFlowId);

      if (preloadedFlow) {
        result = updatePreloadedFlow(preloadedFlow, flowData);
      } else if (savedFlow) {
        result = updateSavedFlow(savedFlow, flowData);
      } else {
        result = saveNewFlow(flowData, currentDate);
      }
    }

    setHasChanges(false);

    setOriginalActivities([...activities]);

    return result;
  };

  /**
   * Loads a flow by its ID and sets it as the current flow
   *
   * @param flowId - ID of the flow to load
   */
  const loadFlow = (flowId: string) => {
    const flow = findFlowById(allFlows, flowId);

    if (flow) {
      const activitiesWithDefaults = flow.activities.map(applyActivityDefaults);

      setActivities(activitiesWithDefaults);
      setOriginalActivities([...activitiesWithDefaults]);
      setCurrentFlowName(flow.projectName);
      setCurrentFlowId(flowId);

      setHasChanges(false);
    }
  };

  /**
   * Deletes a flow by its ID
   *
   * @param flowId - ID of the flow to delete
   * @returns Boolean indicating if the deletion was successful
   */
  const deleteFlow = (flowId: string) => {
    const isPreloaded = isFlowInCollection(preloadedFlowsData, flowId);

    if (isPreloaded) {
      const filteredFlows = filterFlowById(preloadedFlowsData, flowId);
      setPreloadedFlowsData(filteredFlows);
    } else {
      const filteredFlows = filterFlowById(savedFlows, flowId);
      setSavedFlows(filteredFlows);
    }

    if (currentFlowId === flowId) {
      clearActivities();
      setCurrentFlowId(null);
    }

    return true;
  };

  /**
   * Imports a flow from an external source
   * Either updates an existing flow with the same name or creates a new one
   *
   * @param flow - Flow data to import
   * @returns Object indicating if the flow is new or was updated
   */
  const importFlow = (flow: SavedFlow) => {
    const activitiesWithDefaults = flow.activities.map(applyActivityDefaults);

    setActivities(activitiesWithDefaults);
    setOriginalActivities([...activitiesWithDefaults]);
    setCurrentFlowName(flow.projectName);

    const currentDate = getCurrentDateString();
    const existingFlow = findFlowByName(
      [...savedFlows, ...preloadedFlowsData],
      flow.projectName,
    );

    if (existingFlow) {
      setCurrentFlowId(existingFlow.id);

      const flowData = createFlowData(flow.projectName, activitiesWithDefaults);

      const isPreloaded = isFlowInCollection(
        preloadedFlowsData,
        existingFlow.id,
      );

      if (isPreloaded) {
        return updatePreloadedFlow(existingFlow, flowData);
      }

      return updateSavedFlow(existingFlow, flowData);
    }

    setCurrentFlowId(null);

    const flowData = createFlowData(flow.projectName, activitiesWithDefaults);
    return saveNewFlow(flowData, currentDate);
  };

  // Update allFlows when savedFlows or preloadedFlowsData change
  useEffect(() => {
    updateAllFlows();
  }, [savedFlows, preloadedFlowsData]);

  // Check for changes when activities, originalActivities, or currentFlowId change
  useEffect(() => {
    checkForChanges();
  }, [activities, originalActivities, currentFlowId]);

  const contextValue = {
    activities,
    currentActivity,
    isEditing,
    savedFlows,
    currentFlowName,
    currentFlowId,
    preloadedFlowsData,
    hasChanges,
    setActivities,
    addActivity,
    editActivity,
    updateActivity,
    deleteActivity,
    saveFlow,
    loadFlow,
    cancelEditing,
    clearActivities,
    deleteFlow,
    setCurrentFlowName,
    setCurrentFlowId,
    importFlow,
  };

  return (
    <ProcessFlowContext.Provider value={contextValue}>
      {children}
    </ProcessFlowContext.Provider>
  );
};
