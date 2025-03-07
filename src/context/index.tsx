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
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addActivity: (activity: Activity) => void;
  editActivity: (id: string) => void;
  updateActivity: (updatedActivity: Activity) => void;
  deleteActivity: (id: string) => void;
  saveFlow: (flowName: string) => void;
  loadFlow: (flowId: string) => void;
  cancelEditing: () => void;
  clearActivities: () => void;
  deleteFlow: (flowId: string) => void;
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

  // Initialize allFlows with preloaded flows
  useEffect(() => {
    setAllFlows([...preloadedFlowsData, ...savedFlows]);
  }, [savedFlows, preloadedFlowsData]);

  // Ensure activity has valid properties
  const sanitizeActivity = (activity: Activity): Activity => {
    return {
      ...activity,
      color: activity.color || DEFAULT_COLOR,
      inputs: activity.inputs || [],
      outputs: activity.outputs || [],
      assignedUsers: activity.assignedUsers || [],
    };
  };

  const addActivity = (activity: Activity) => {
    const sanitizedActivity = sanitizeActivity({
      ...activity,
      id: Date.now().toString(),
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
  };

  const saveFlow = (projectFlowName: string) => {
    // Ensure all activities are sanitized before saving
    const sanitizedActivities = activities.map(sanitizeActivity);
    const currentDate = new Date().toLocaleDateString();

    if (currentFlowId) {
      // Create the updated flow object
      const updatedFlow: SavedFlow = {
        id: currentFlowId,
        projectName: projectFlowName,
        activities: sanitizedActivities,
        createdAt: currentDate, // Will be overridden if we find existing flow
        lastModified: currentDate,
      };

      // Check if it's a preloaded flow
      const isPreloadedFlow = preloadedFlowsData.some(f => f.id === currentFlowId);
      
      if (isPreloadedFlow) {
        // Update preloaded flow
        const existingFlow = preloadedFlowsData.find(f => f.id === currentFlowId);
        if (existingFlow) {
          updatedFlow.createdAt = existingFlow.createdAt; // Keep original creation date
        }
        
        const updatedPreloadedFlows = preloadedFlowsData.map(flow =>
          flow.id === currentFlowId ? updatedFlow : flow
        );
        
        setPreloadedFlowsData(updatedPreloadedFlows);
      } else {
        // Check if it's in saved flows
        const existingFlow = savedFlows.find(f => f.id === currentFlowId);
        
        if (existingFlow) {
          // Update saved flow
          updatedFlow.createdAt = existingFlow.createdAt; // Keep original creation date
          
          const updatedSavedFlows = savedFlows.map(flow =>
            flow.id === currentFlowId ? updatedFlow : flow
          );
          
          setSavedFlows(updatedSavedFlows);
        } else {
          // If we can't find it in either list (shouldn't happen), create new
          const newFlow = {
            ...updatedFlow,
            id: crypto.randomUUID(),
            createdAt: currentDate,
          };
          setSavedFlows([...savedFlows, newFlow]);
          setCurrentFlowId(newFlow.id);
        }
      }
    } else {
      // Create new flow when no currentFlowId exists
      const newFlow: SavedFlow = {
        id: crypto.randomUUID(),
        projectName: projectFlowName,
        activities: sanitizedActivities,
        createdAt: currentDate,
        lastModified: currentDate,
      };
      setSavedFlows([...savedFlows, newFlow]);
      setCurrentFlowId(newFlow.id);
    }
  };

  const loadFlow = (flowId: string) => {
    const flow = allFlows.find((f) => f.id === flowId);
    if (flow) {
      const sanitizedActivities = flow.activities.map(sanitizeActivity);
      setActivities(sanitizedActivities);
      setCurrentFlowName(flow.projectName);
      setCurrentFlowId(flowId); // This is the crucial line that was missing
    }
  };
  
  const cancelEditing = () => {
    setCurrentActivity(null);
    setIsEditing(false);
  };

  const deleteFlow = (flowId: string) => {
    // Check if it's a preloaded flow
    const isPreloadedFlow = preloadedFlowsData.some(f => f.id === flowId);
    
    if (isPreloadedFlow) {
      // Remove from preloaded flows
      setPreloadedFlowsData(preloadedFlowsData.filter((flow) => flow.id !== flowId));
    } else {
      // Remove from saved flows
      setSavedFlows(savedFlows.filter((flow) => flow.id !== flowId));
    }
    
    // If the currently loaded flow is being deleted, clear the activities
    if (currentFlowId === flowId) {
      clearActivities();
      setCurrentFlowId(null);
    }
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