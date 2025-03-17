import type { Dayjs } from 'dayjs';

/**
 * Props for error message component
 * Used to display detailed error information
 */
export interface ErrorMessageProps {
  /** Main error message to display */
  message: string;
  /** Additional error details */
  details: string;
  /** Stack trace (displayed only in development mode) */
  stack?: string;
}

/**
 * Activity type definition
 * Represents a single activity node in a process flow
 */
export type Activity = {
  /** Unique identifier for the activity */
  id: string;
  /** Name of the activity */
  activityName?: string;
  /** Description of what the activity entails */
  description?: string;
  /** Array of input dependencies from other activities */
  inputs?: string[];
  /** Array of outputs to other activities */
  outputs?: string[];
  /** Background color for the activity node */
  color?: string;
  /** Array of users assigned to this activity */
  assignedUsers?: string[];
  /** Whether the activity is empty (for placeholders) */
  isEmpty?: boolean;
  /** Position coordinates for the activity in the flow diagram */
  position?: {
    x: number;
    y: number;
  };
  /** Deadline for completing the activity */
  deadline?: Dayjs | string;
  /** Criteria for activity approval */
  approvalCriteria?: string;
};

/**
 * SavedFlow type definition
 * Represents a complete process flow with metadata and activities
 */
export type SavedFlow = {
  /** Unique identifier for the flow */
  id: string;
  /** Name of the project flow */
  projectName: string;
  /** Date when the flow was created */
  createdAt: string;
  /** Date when the flow was last modified */
  lastModified: string;
  /** Array of activities that make up the flow */
  activities: Activity[];
};
