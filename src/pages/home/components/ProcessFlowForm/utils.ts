import type { Activity } from '@/interfaces';
import { DEFAULT_COLOR } from '@/utils';
import type { FormValues } from './index';

/**
 * Extract color value from various possible input types
 */
export const getColorValue = (
  colorInput: string | { toHexString?: () => string } | null | undefined,
): string => {
  // If no color input, return default
  if (!colorInput) {
    return DEFAULT_COLOR;
  }

  // If it's already a string (which it should be with format="hex"), return it
  if (typeof colorInput === 'string') {
    return colorInput;
  }

  // If it's an object (shouldn't happen with format="hex" but just in case)
  if (typeof colorInput === 'object' && colorInput.toHexString) {
    return colorInput.toHexString();
  }

  // For any other case, return default
  return DEFAULT_COLOR;
};

/**
 * Creates an activity object from form values
 */
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
    inputs: values.inputs || [],
    outputs: values.outputs || [],
    color: getColorValue(values.color),
    assignedUsers: values.assignedUsers || [],
  };

  return activity;
};
