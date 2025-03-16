import type { Rule } from 'antd/es/form';

export const VALIDATION_RULES = {
  ACTIVITY_NAME: [] as Rule[],
};

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
