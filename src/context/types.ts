import type { Activity, SavedFlow } from '@/interfaces';
import type { ReactNode } from 'react';

export interface ProcessFlowContextType {
  // State
  activities: Activity[];
  currentActivity: Activity | null;
  isEditing: boolean;
  savedFlows: SavedFlow[];
  currentFlowName: string;
  currentFlowId: string | null;
  preloadedFlowsData: SavedFlow[];
  hasChanges: boolean;

  // Actions
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
  setCurrentFlowId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ProcessFlowProviderProps {
  children: ReactNode;
}
