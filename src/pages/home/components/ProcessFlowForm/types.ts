import type { Dayjs } from 'dayjs';

export type FormValues = {
  projectFlowName?: string;
  activityName?: string;
  description?: string;
  color?: string;
  assignedUsers?: string[];
  deadline?: Dayjs | string;
  approvalCriteria?: string;
  priority?: string;
};
