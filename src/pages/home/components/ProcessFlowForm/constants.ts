export const ProcessFlowFormText = {
  MAIN_TITLE: 'Process flow configurator',
  PROJECT_FLOW: {
    LABEL: 'Project flow name',
    PLACEHOLDER: 'Enter process flow name',
    ERROR_MESSAGE: 'Please input project flow name!',
    TOOLTIP:
      'Add a maximum of 4 activities to the process flow. Each activity can be assigned to one or more users.',
  },
  ACTIVITIES: {
    TITLE: 'Activities configurator',
    TOOLTIP: '(Configure activity nodes)',
    ACTIVITY_NAME: {
      LABEL: 'Activity name',
      PLACEHOLDER: 'E.g., Content Creation, Review',
      ERROR_MESSAGE: 'Required',
    },
    DESCRIPTION: {
      LABEL: 'Description',
      PLACEHOLDER: 'Brief description of this activity',
      ERROR_MESSAGE: 'Required',
    },
    INPUTS: {
      LABEL: 'Inputs',
      PLACEHOLDER: 'Add inputs',
    },
    OUTPUTS: {
      LABEL: 'Outputs',
      PLACEHOLDER: 'Add outputs',
    },
    COLOR: {
      LABEL: 'Color',
    },
    USERS: {
      LABEL: 'Assigned Users',
      PLACEHOLDER: 'Select users',
      ERROR_MESSAGE: 'Required',
      OPTIONS: [
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Jane Smith', label: 'Jane Smith' },
        { value: 'Robert Johnson', label: 'Robert Johnson' },
      ],
    },
    BUTTON: {
      ADD_ACITIVTY: 'Add ',
      RESET_FORM: 'Reset',
      CANCEL: 'Cancel',
      UPDATE: 'Update',
    },
  },
};
