export type FieldType = {
  projectFlowName?: string;
  activityName?: string;
  description?: string;
  color?: string;
  assignedUsers?: string[];
  deadline?: string;
  approvalCriteria?: string;
  priority?: string;
  notifyUsers?: string[];
};

export interface FormValues {
  projectFlowName?: string;
  activityName?: string;
  description?: string;
  color?: string | { toHexString?: () => string } | null | undefined;
  assignedUsers?: string[];
  deadline?: string;
  approvalCriteria?: string;
  priority?: string;
  notifyUsers?: string[];
}
