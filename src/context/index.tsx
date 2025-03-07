import { preloadedFlows } from '@/pages/home/components/ProcessFlowTable/mocks';
import React, { createContext, useEffect, useState } from 'react';

export type Activity = {
  id: string;
  activityName?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  color?: string;
  assignedUsers?: string[];
  isEmpty?: boolean;
};

export type SavedFlow = {
  id: string;
  projectName: string;
  createdAt: string;
  lastModified: string;
  activities: Activity[];
};

// Default color to use when none is specified
const DEFAULT_COLOR = '#1677ff';

interface ProcessFlowContextType {
  activities: Activity[];
  currentActivity: Activity | null;
  isEditing: boolean;
  savedFlows: SavedFlow[];
  currentFlowName: string;
  currentFlowId: string | null;
  preloadedFlowsData: SavedFlow[];
  hasChanges: boolean;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addActivity: (activity: Activity) => void;
  editActivity: (id: string) => void;
  updateActivity: (updatedActivity: Activity) => void;
  deleteActivity: (id: string) => void;
  saveFlow: (flowName: string) => { isNew: boolean; isUpdated: boolean };
  loadFlow: (flowId: string) => void;
  cancelEditing: () => void;
  clearActivities: () => void;
  deleteFlow: (flowId: string) => boolean;
  setCurrentFlowName: React.Dispatch<React.SetStateAction<string>>;
  importFlow: (flow: SavedFlow) => { isNew: boolean; isUpdated: boolean };
}

interface ProcessFlowProviderProps {
  children: React.ReactNode;
}

export const ProcessFlowContext = createContext<ProcessFlowContextType | null>(
  null,
);

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

  // Initialize allFlows with preloaded flows
  useEffect(() => {
    setAllFlows([...preloadedFlowsData, ...savedFlows]);
  }, [savedFlows, preloadedFlowsData]);

  // Track changes to activities
  useEffect(() => {
    if (currentFlowId && originalActivities.length > 0) {
      // Compare current activities with original ones
      const activitiesChanged =
        JSON.stringify(activities) !== JSON.stringify(originalActivities);
      setHasChanges(activitiesChanged);
    } else if (activities.length > 0 && !currentFlowId) {
      // New flow with activities
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [activities, originalActivities, currentFlowId]);

  // Ensure activity has valid properties
  const sanitizeActivity = (activity: Activity): Activity => {
    // Important: preserve the ID and all other properties
    return {
      ...activity,
      // Only add defaults for missing properties
      color: activity.color || DEFAULT_COLOR,
      inputs: activity.inputs || [],
      outputs: activity.outputs || [],
      assignedUsers: activity.assignedUsers || [],
    };
  };

  const addActivity = (activity: Activity) => {
    const sanitizedActivity = sanitizeActivity({
      ...activity,
      id: activity.id || Date.now().toString(),
    });
    setActivities([...activities, sanitizedActivity]);
  };

  const editActivity = (id: string) => {
    const activity = activities.find((a) => a.id === id);
    if (activity) {
      setCurrentActivity(sanitizeActivity(activity));
      setIsEditing(true);
    }
  };

  const updateActivity = (updatedActivity: Activity) => {
    const sanitizedActivity = sanitizeActivity(updatedActivity);
    setActivities(
      activities.map((a) =>
        a.id === updatedActivity.id ? sanitizedActivity : a,
      ),
    );
    setCurrentActivity(null);
    setIsEditing(false);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const clearActivities = () => {
    setActivities([]);
    setCurrentFlowName('');
    setOriginalActivities([]);
    setHasChanges(false);
  };

  const saveFlow = (projectFlowName: string) => {
    // Ensure all activities are sanitized before saving
    const sanitizedActivities = activities.map(sanitizeActivity);
    const currentDate = new Date().toLocaleDateString();

    // Create base flow object with common properties
    const flowData: Partial<SavedFlow> = {
      projectName: projectFlowName,
      activities: sanitizedActivities,
      lastModified: currentDate,
    };

    // Handle case when there's no current flow ID (always create new)
    if (!currentFlowId) {
      return createNewFlow(flowData, currentDate);
    }

    // Try to find existing flow
    const preloadedFlow = preloadedFlowsData.find(
      (f) => f.id === currentFlowId,
    );
    const savedFlow = savedFlows.find((f) => f.id === currentFlowId);

    // Update existing flow if found
    if (preloadedFlow) {
      return updatePreloadedFlow(preloadedFlow, flowData);
    }

    if (savedFlow) {
      return updateSavedFlow(savedFlow, flowData);
    }

    // If flow ID exists but flow not found, create new
    return createNewFlow(flowData, currentDate);
  };

  // Helper functions
  const createNewFlow = (
    flowData: Partial<SavedFlow>,
    creationDate: string,
  ) => {
    const newFlow: SavedFlow = {
      ...flowData,
      id: crypto.randomUUID(),
      createdAt: creationDate,
      lastModified: creationDate,
    } as SavedFlow;

    setSavedFlows([...savedFlows, newFlow]);
    setCurrentFlowId(newFlow.id);

    return { isNew: true, isUpdated: false };
  };

  const updatePreloadedFlow = (
    existingFlow: SavedFlow,
    flowData: Partial<SavedFlow>,
  ) => {
    const updatedFlow: SavedFlow = {
      ...flowData,
      id: currentFlowId,
      createdAt: existingFlow.createdAt,
    } as SavedFlow;

    const updatedPreloadedFlows = preloadedFlowsData.map((flow) =>
      flow.id === currentFlowId ? updatedFlow : flow,
    );

    setPreloadedFlowsData(updatedPreloadedFlows);

    return { isNew: false, isUpdated: true };
  };

  const updateSavedFlow = (
    existingFlow: SavedFlow,
    flowData: Partial<SavedFlow>,
  ) => {
    const updatedFlow: SavedFlow = {
      ...flowData,
      id: currentFlowId,
      createdAt: existingFlow.createdAt, // Keep original creation date
    } as SavedFlow;

    const updatedSavedFlows = savedFlows.map((flow) =>
      flow.id === currentFlowId ? updatedFlow : flow,
    );

    setSavedFlows(updatedSavedFlows);

    return { isNew: false, isUpdated: true };
  };

  const loadFlow = (flowId: string) => {
    const flow = allFlows.find((f) => f.id === flowId);
    if (flow) {
      const sanitizedActivities = flow.activities.map(sanitizeActivity);
      setActivities(sanitizedActivities);
      // Save a copy of the original activities for change detection
      setOriginalActivities([...sanitizedActivities]);
      setCurrentFlowName(flow.projectName);
      setCurrentFlowId(flowId);
      setHasChanges(false); // Reset changes flag when loading
    }
  };

  const cancelEditing = () => {
    setCurrentActivity(null);
    setIsEditing(false);
  };

  const deleteFlow = (flowId: string) => {
    // Check if it's a preloaded flow
    const isPreloadedFlow = preloadedFlowsData.some((f) => f.id === flowId);

    if (isPreloadedFlow) {
      // Remove from preloaded flows
      setPreloadedFlowsData(
        preloadedFlowsData.filter((flow) => flow.id !== flowId),
      );
    } else {
      // Remove from saved flows
      setSavedFlows(savedFlows.filter((flow) => flow.id !== flowId));
    }

    // If the currently loaded flow is being deleted, clear the activities
    if (currentFlowId === flowId) {
      clearActivities();
      setCurrentFlowId(null);
    }

    return true; // Return success for notification
  };

  // Import flow from external JSON
  const importFlow = (flow: SavedFlow) => {
    // Make sure we sanitize all activities in the imported flow
    const sanitizedActivities = flow.activities.map(sanitizeActivity);

    // Set current state to the imported flow
    setActivities(sanitizedActivities);
    // IMPORTANT: Also set originalActivities to prevent change detection from marking everything changed
    setOriginalActivities([...sanitizedActivities]);
    setCurrentFlowName(flow.projectName);

    // Create or update flow
    const currentDate = new Date().toLocaleDateString();

    // Check if flow with same name exists
    const existingFlow = [...savedFlows, ...preloadedFlowsData].find(
      (f) => f.projectName === flow.projectName,
    );

    if (existingFlow) {
      // Update existing flow
      setCurrentFlowId(existingFlow.id);

      const flowData: Partial<SavedFlow> = {
        projectName: flow.projectName,
        activities: sanitizedActivities,
        lastModified: currentDate,
      };

      if (preloadedFlowsData.some((f) => f.id === existingFlow.id)) {
        return updatePreloadedFlow(existingFlow, flowData);
      }
      return updateSavedFlow(existingFlow, flowData);
    }

    // Create new flow
    setCurrentFlowId(null); // Clear ID to force new creation

    const flowData: Partial<SavedFlow> = {
      projectName: flow.projectName,
      activities: sanitizedActivities,
      lastModified: currentDate,
    };

    return createNewFlow(flowData, currentDate);
  };

  return (
    <ProcessFlowContext.Provider
      value={{
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
        importFlow,
      }}
    >
      {children}
    </ProcessFlowContext.Provider>
  );
};

// Utility hook for using the context
export const useProcessFlow = () => {
  const context = React.useContext(ProcessFlowContext);
  if (context === null) {
    throw new Error('useProcessFlow must be used within a ProcessFlowProvider');
  }
  return context;
};
