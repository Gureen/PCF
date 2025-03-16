import { DEFAULT_COLOR } from '@/constants/text';
import type { Activity } from '@/interfaces';
import type { FormValues } from './types';

export const getColorValue = (
  colorInput: string | { toHexString?: () => string } | null | undefined,
): string => {
  if (typeof colorInput === 'string') {
    return colorInput;
  }

  if (colorInput?.toHexString) {
    return colorInput.toHexString();
  }

  return DEFAULT_COLOR;
};

export const createActivityObject = (
  values: FormValues,
  isEditing: boolean,
  currentActivity: Activity | null,
): Activity => ({
  id: isEditing && currentActivity ? currentActivity.id : crypto.randomUUID(),
  activityName: values.activityName,
  description: values.description,
  assignedUsers: values.assignedUsers,
  color: getColorValue(values.color),
  deadline: values.deadline,
  approvalCriteria: values.approvalCriteria,
});
