export interface ErrorMessageProps {
  message: string;
  details: string;
  stack?: string;
}

export type Activity = {
  id: string;
  activityName?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  color?: string;
  assignedUsers?: string[];
  isEmpty?: boolean;
  position?: {
    x: number;
    y: number;
  };
};

export type SavedFlow = {
  id: string;
  projectName: string;
  createdAt: string;
  lastModified: string;
  activities: Activity[];
};
