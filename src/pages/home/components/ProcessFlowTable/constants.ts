export const PROCESS_FLOW_TEXT = {
  TITLE: 'Saved process flows',
  TOOLTIP: 'Load, edit, or export your previously configured process flows.',
  SEARCH_PLACEHOLDER: 'Search by project name',
  PAGINATION_TOTAL: (total: number) => `Total ${total} items`,

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
  },
};
