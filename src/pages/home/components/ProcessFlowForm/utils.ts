import { DEFAULT_COLOR } from '@/constants';
import type { Activity } from '@/interfaces';
import type { FormValues } from './types';

/**
 * Extracts a valid color string from various possible color inputs
 * @param colorInput Color value which can be a string, object with toHexString method, or undefined
 * @returns Valid color string or default color if input is invalid
 */
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

/**
 * Creates an activity object from form values
 * @param values Form values from the activity form
 * @param isEditing Whether we are editing an existing activity
 * @param currentActivity Current activity being edited (if any)
 * @returns Complete activity object ready to be added to the flow
 */
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
