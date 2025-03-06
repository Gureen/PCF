export const ACTIVITY_TEXT = {
  TITLE: 'Configured Activities',
  EMPTY_DESCRIPTION: 'Activity not configured',
  INPUTS_LABEL: 'Inputs: ',
  OUTPUTS_LABEL: 'Outputs: ',
  ASSIGNED_LABEL: 'Assigned to: ',
  DESCRIPTION: 'Description: ',
};

export const GRID_CONFIG = {
  gutter: 16,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 2,
  xxl: 2,
};

export const MAX_ACTIVITIES = 4;

export const inputOptions = [
  { label: 'Document Upload', value: 'document_upload' },
  { label: 'Customer Information', value: 'customer_info' },
  { label: 'Manager Approval', value: 'manager_approval' },
  { label: 'Email', value: 'email' },
  { label: 'Team Assignment', value: 'team_assignment' },
];

export const outputOptions = [
  { label: 'Final Report', value: 'final_report' },
  { label: 'Status Report', value: 'status_report' },
  { label: 'Analysis Results', value: 'analysis_results' },
  { label: 'Task Assignment', value: 'task_assignment' },
  { label: 'Approval Notification', value: 'approval_notification' },
];
