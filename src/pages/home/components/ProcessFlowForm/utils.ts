import type { Activity } from '@/interfaces';
import { DEFAULT_COLOR } from '@/utils';
import type { FormValues } from './types';

export const getColorValue = (
  colorInput: string | { toHexString?: () => string } | null | undefined,
): string => {
  if (!colorInput) {
    return DEFAULT_COLOR;
  }

  if (typeof colorInput === 'string') {
    return colorInput;
  }

  if (typeof colorInput === 'object' && colorInput.toHexString) {
    return colorInput.toHexString();
  }

  return DEFAULT_COLOR;
};

export const createActivityObject = (
  values: FormValues,
  isEditing: boolean,
  currentActivity: Activity | null,
): Activity => {
  const activityId =
    isEditing && currentActivity ? currentActivity.id : Date.now().toString();

  const activity: Activity = {
    id: activityId,
    activityName: values.activityName,
    description: values.description,
    color: getColorValue(values.color),
    assignedUsers: values.assignedUsers || [],
  };

  return activity;
};
