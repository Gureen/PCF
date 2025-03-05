export type ActivityType = {
  id: string;
  activityName: string;
  description: string;
  inputs: string[];
  outputs: string[];
  assignedUsers: string[];
  isEmpty?: boolean;
};
