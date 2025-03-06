import React, { createContext, useState } from 'react';

export type Activity = {
  id: string;
  activityName?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  color?: string;
  assignedUsers?: string[];
  [key: string]: string | string[] | undefined;
};

export type SavedFlow = {
  id: string;
  projectName: string;
  activities: Activity[];
  createdAt: string;
  lastModified: string;
};

interface ProcessFlowContextType {
  activities: Activity[];
  currentActivity: Activity | null;
  isEditing: boolean;
  savedFlows: SavedFlow[];
  addActivity: (activity: Activity) => void;
  editActivity: (id: string) => void;
  updateActivity: (updatedActivity: Activity) => void;
  deleteActivity: (id: string) => void;
  saveFlow: (flowName: string) => void;
  loadFlow: (flowId: string) => void;
  cancelEditing: () => void;
  clearActivities: () => void;
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

  const addActivity = (activity: Activity) => {
    setActivities([...activities, { ...activity, id: Date.now().toString() }]);
  };

  const editActivity = (id: string) => {
    const activity = activities.find((a) => a.id === id);
    if (activity) {
      setCurrentActivity(activity);
      setIsEditing(true);
    }
  };

  const updateActivity = (updatedActivity: Activity) => {
    setActivities(
      activities.map((a) =>
        a.id === updatedActivity.id ? updatedActivity : a,
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

  const saveFlow = (flowName: string) => {
    const newFlow: SavedFlow = {
      id: Date.now().toString(),
      projectName: flowName,
      activities: [...activities],
      createdAt: new Date().toLocaleDateString(),
      lastModified: new Date().toLocaleDateString(),
    };
    setSavedFlows([...savedFlows, newFlow]);
  };

  const loadFlow = (flowId: string) => {
    const flow = savedFlows.find((f) => f.id === flowId);
    if (flow) {
      setActivities(flow.activities);
    }
  };

  const cancelEditing = () => {
    setCurrentActivity(null);
    setIsEditing(false);
  };

  return (
    <ProcessFlowContext.Provider
      value={{
        activities,
        currentActivity,
        isEditing,
        savedFlows,
        addActivity,
        editActivity,
        updateActivity,
        deleteActivity,
        saveFlow,
        loadFlow,
        cancelEditing,
        clearActivities,
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
