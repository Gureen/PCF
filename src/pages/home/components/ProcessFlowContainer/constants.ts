import { enLanguage } from '@/language/english';

/**
 * Configuration object for table pagination
 * Defines page size, options and total text display
 */
export const paginationConfig = {
  /** Number of items to display per page */
  pageSize: 3,
  /** Disable the page size changer dropdown */
  showSizeChanger: false,
  /** Function to display total item count text */
  showTotal: enLanguage.PROCESS_FLOW.PAGINATION_TOTAL,
};
