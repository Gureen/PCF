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

  const updateAllFlows = () => {
    setAllFlows([...preloadedFlowsData, ...savedFlows]);
  };

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

  const addActivity = (activity: Activity) => {
    const activityWithId = addIdToActivity(activity);
    const activityWithDefaults = applyActivityDefaults(activityWithId);

    setActivities([...activities, activityWithDefaults]);
  };

  const editActivity = (id: string) => {
    const activity = activities.find((a) => a.id === id);

    if (activity) {
      const activityWithDefaults = applyActivityDefaults(activity);
      setCurrentActivity(activityWithDefaults);
      setIsEditing(true);
    }
  };

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

  const deleteActivity = (id: string) => {
    const filteredActivities = activities.filter((a) => a.id !== id);
    setActivities(filteredActivities);
  };

  const clearActivities = () => {
    setActivities([]);
    setOriginalActivities([]);
    setHasChanges(false);
  };

  const cancelEditing = () => {
    setCurrentActivity(null);
    setIsEditing(false);
  };

  const saveNewFlow = (flowData: Partial<SavedFlow>, currentDate: string) => {
    const newFlow = createNewFlow(flowData, currentDate);
    setSavedFlows([...savedFlows, newFlow]);
    setCurrentFlowId(newFlow.id);

    return getNewFlowResult();
  };

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

  // Updated saveFlow function for ProcessFlowProvider
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

  useEffect(() => {
    updateAllFlows();
  }, [savedFlows, preloadedFlowsData]);

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
