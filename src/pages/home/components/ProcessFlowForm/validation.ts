import type { Rule } from 'antd/es/form';

/**
 * Base validation rules organized by form field
 * Can be extended with additional field-specific rules
 */
export const VALIDATION_RULES = {
  ACTIVITY_NAME: [] as Rule[],
};

/**
 * Validation rules for the activity name field
 * Ensures activity name is not empty or just whitespace
 */
export const activityNameValidation: Rule[] = [
  ...VALIDATION_RULES.ACTIVITY_NAME,
  {
    validator: (_, value) => {
      if (value && value.trim() === '') {
        return Promise.reject(
          'Activity name cannot be empty or just whitespace',
        );
      }
      return Promise.resolve();
    },
  },
];

/**
 * Validation rules for the approval criteria field
 * Ensures approval criteria is not just whitespace if provided
 */
export const approvalCriteriaValidation: Rule[] = [
  {
    validator: (_, value) => {
      if (value && value.trim() === '') {
        return Promise.reject('Approval criteria cannot be just whitespace');
      }
      return Promise.resolve();
    },
  },
];

/**
 * Validation rules for the description field
 * Ensures description is not just whitespace if provided
 */
export const descriptionValidation: Rule[] = [
  {
    validator: (_, value) => {
      if (value && value.trim() === '') {
        return Promise.reject('Description cannot be just whitespace');
      }
      return Promise.resolve();
    },
  },
];
