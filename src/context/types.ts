import type { Activity, SavedFlow } from '@/interfaces';
import type { ReactNode } from 'react';

/**
 * Type definition for the ProcessFlow context
 *
 * Contains both state values and action methods for managing process flows
 */
export interface ProcessFlowContextType {
  /** Array of all activities in the current flow */
  activities: Activity[];

  /** Currently selected activity for viewing or editing, null if none selected */
  currentActivity: Activity | null;

  /** Boolean flag indicating if an activity is being edited */
  isEditing: boolean;

  /** Array of all user-saved flows */
  savedFlows: SavedFlow[];

  /** Name of the currently active flow */
  currentFlowName: string;

  /** ID of the currently active flow, null if creating a new flow */
  currentFlowId: string | null;

  /** Array of pre-defined template flows provided by the system */
  preloadedFlowsData: SavedFlow[];

  /** Boolean flag indicating if the current flow has unsaved changes */
  hasChanges: boolean;

  /** State setter for activities array */
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;

  /** Adds a new activity to the current flow */
  addActivity: (activity: Activity) => void;

  /** Selects an activity for editing by its ID */
  editActivity: (id: string) => void;

  /** Updates an existing activity with new values */
  updateActivity: (updatedActivity: Activity) => void;

  /** Removes an activity from the current flow by its ID */
  deleteActivity: (id: string) => void;

  /**
   * Saves the current flow with the given name
   * @returns Object indicating if the flow is new or updated
   */
  saveFlow: (flowName: string) => { isNew: boolean; isUpdated: boolean };

  /** Loads a flow by its ID */
  loadFlow: (flowId: string) => void;

  /** Cancels the current activity editing operation */
  cancelEditing: () => void;

  /** Removes all activities from the current flow */
  clearActivities: () => void;

  /**
   * Deletes a flow by its ID
   * @returns Boolean indicating if the deletion was successful
   */
  deleteFlow: (flowId: string) => boolean;

  /** State setter for the current flow name */
  setCurrentFlowName: React.Dispatch<React.SetStateAction<string>>;

  /**
   * Imports a flow from an external source
   * @returns Object indicating if the flow is new or updated
   */
  importFlow: (flow: SavedFlow) => { isNew: boolean; isUpdated: boolean };

  /** State setter for the current flow ID */
  setCurrentFlowId: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Props for the ProcessFlowProvider component
 */
export interface ProcessFlowProviderProps {
  /** Child components that will have access to the ProcessFlow context */
  children: ReactNode;
}
