export const enLanguage = {
  MAIN_TITLE: 'Process flow configurator',
  PROJECT_FLOW: {
    LABEL: 'Project flow name',
    PLACEHOLDER: 'Enter process flow name.',
    ERROR_MESSAGE: 'Please input project flow name!',
    TOOLTIP:
      'Add a maximum of 4 activities to the process flow. Each activity can be assigned to one or more users.',
  },
  ACTIVITIES: {
    TITLE: 'Activities configurator',
    TOOLTIP: '(Configure activity nodes)',
    ACTIVITY_NAME: {
      LABEL: 'Activity name',
      PLACEHOLDER: 'E.g., Content Creation, Review.',
      ERROR_MESSAGE: 'Required',
    },
    DESCRIPTION: {
      LABEL: 'Description',
      PLACEHOLDER: 'Brief description of this activity.',
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
    DEADLINE: {
      LABEL: 'Deadline',
      TOOLTIP: 'Set a deadline for this activity',
      PLACEHOLDER: 'Select a deadline',
    },
    APPROVAL_CRITERIA: {
      LABEL: 'Approval criteria',
      TOOLTIP: 'Define what is required for this activity to be approved.',
      PLACEHOLDER: 'E.g., Requires manager approval for amounts over $1000.',
    },
    USERS: {
      LABEL: 'Assigned users',
      PLACEHOLDER: 'Select users',
      ERROR_MESSAGE: 'Required',
    },
    BUTTON: {
      ADD_ACITIVTY: 'New',
      RESET_FORM: 'Clear',
      CANCEL: 'Cancel',
      UPDATE: 'Update',
    },
  },
  PROCESS_FLOW: {
    TITLE: 'Saved process flows',
    TOOLTIP: 'Load, edit, or export your previously configured process flows.',
    SEARCH_PLACEHOLDER: 'Search by project name',
    PAGINATION_TOTAL: (total: number) => `Total ${total} items`,
    IMPORT_MODAL: {
      TITLE: 'Import Process Flow',
      DESCRIPTION: 'Are you sure you want to import the flow',
      UNSAVED_CHANGES_WARNING: 'Warning: You have unsaved changes',
      SUCCESS: 'Process flow imported successfully',
      ERROR: 'Failed to import process flow',
      CONFIRM: 'Import',
      CANCEL: 'Cancel',
      SELECT_FILE: 'Please select a file to import',
      IMPORT_CONFIRMATION: 'Ready to import process flow',
      READY_TO_IMPORT: 'Ready to import',
      LAST_MODIFIED: 'Last modified',
      DISCARD_WARNING:
        'Importing this flow will discard your current unsaved changes.',
      ADDITIONAL_INSTRUCTIONS:
        'After importing, the process flow will be available in your saved flows list.',
      NO_FILE_SELECTED: 'No file selected',
      FILE_DETAILS: 'File details',
      IMPORT_SUCCESS: 'Flow imported successfully!',
      UPDATED_SUCCESS: 'Flow updated successfully!',
      LOADING: 'Processing file...',
    },
    WARNING_MODAL: {
      TITLE: 'Unsaved Changes',
      ALERT_TITLE: 'Warning: Unsaved Changes',
      DESCRIPTION_1: 'You have unsaved changes to',
      DESCRIPTION_2: 'If you load',
      DESCRIPTION_3: ', your current changes will be lost.',
      ANOTHER_FLOW: 'another flow',
      CONFIRMATION_QUESTION:
        'Do you want to discard your changes and continue?',
      CONFIRM: 'Discard Changes and Load',
      CANCEL: 'Cancel',
    },
    DELETE_CONFIRM: {
      TITLE: 'Delete this process flow?',
      DESCRIPTION: 'Are you sure you want to delete this process flow?',
      OK: 'Yes',
      CANCEL: 'No',
    },
    COLUMN: {
      PROJECT_NAME: 'Project Name',
      CREATED: 'Created',
      LAST_MODIFIED: 'Last Modified',
      ACTIONS: 'Actions',
    },
    ACTION: {
      LOAD: 'Load',
      EXPORT: 'Export as JSON',
      DELETE: 'Delete',
      IMPORT: 'Import',
    },
  },
  ACTION_BUTTONS: {
    SAVE_BUTTON: 'Save',
    UPDATE_BUTTON: 'Update',
    CLEAR_BUTTON: 'Clear',
    NEW_BUTTON: 'New',
    ADD_BUTTON: 'Add',
    MESSAGES: {
      NEW_FLOW_SUCCESS: 'Started new process flow',
      PROCESS_CREATED: 'The process has been created.',
      PROCESS_UPDATED: 'The process has been updated.',
      VALIDATION: {
        PROJECT_NAME_REQUIRED: 'Project flow name is required.',
        TWO_ACTIVITIES_REQUIRED: 'At least two activities are required.',
        CONNECTION_REQUIRED: 'Each activity must have at least one connection.',
      },
    },
  },
  ACTIVITY_TEMPLATES: {
    TITLE: 'Activity Templates',
    TOOLTIP: 'Drag and drop templates to create your project workflow',
  },
};
