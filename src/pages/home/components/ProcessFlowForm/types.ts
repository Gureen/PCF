import type { Dayjs } from 'dayjs';

/**
 * Interface representing the values in the process flow form
 * Used for form data handling and validation
 */
export type FormValues = {
  /** Name of the project flow */
  projectFlowName?: string;
  /** Name of the activity */
  activityName?: string;
  /** Description of the activity */
  description?: string;
  /** Color for the activity node */
  color?: string;
  /** Array of user IDs assigned to this activity */
  assignedUsers?: string[];
  /** Deadline for the activity completion */
  deadline?: Dayjs | string;
  /** Criteria for activity approval */
  approvalCriteria?: string;
  /** Priority level for the activity */
  priority?: string;
};
