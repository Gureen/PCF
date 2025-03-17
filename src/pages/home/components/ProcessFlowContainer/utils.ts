import type { Activity, SavedFlow } from '@/interfaces';
import type { UploadProps } from 'antd';
import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

/**
 * Validates the structure of a flow from imported JSON
 * Ensures it has required properties like projectName and activities
 * @param content JSON string containing the flow data
 * @returns Parsed SavedFlow object if valid
 * @throws Error if the flow structure is invalid
 */
const validateFlowStructure = (content: string): SavedFlow => {
  const parsedFlow = JSON.parse(content) as SavedFlow;

  if (!(parsedFlow.projectName && Array.isArray(parsedFlow.activities))) {
    throw new Error('Invalid flow format');
  }

  return parsedFlow;
};

/**
 * Validates activities in a flow
 * Ensures each activity has a valid ID, generating new ones if needed
 * @param activities Array of activities to validate
 * @returns Validated array of activities
 */
const validateActivities = (activities: Activity[]): Activity[] => {
  return activities.map((activity) => {
    if (!activity.id) {
      return {
        ...activity,
        id: crypto.randomUUID(),
      };
    }
    return activity;
  });
};

/**
 * Creates a validated flow with all required properties
 * Fills in missing values with defaults and validates activities
 * @param parsedFlow The parsed flow object to validate
 * @returns A complete SavedFlow object with all required properties
 */
const createValidatedFlow = (parsedFlow: SavedFlow): SavedFlow => {
  const validatedActivities = validateActivities(parsedFlow.activities);

  return {
    ...parsedFlow,
    activities: validatedActivities,
    id: parsedFlow.id || crypto.randomUUID(),
    createdAt: parsedFlow.createdAt || new Date().toLocaleDateString(),
    lastModified: new Date().toLocaleDateString(),
  };
};

/**
 * Processes the content of an imported file
 * Validates the structure and opens the import modal if valid
 * @param content File content as string
 * @param setImportedFlow Function to set the imported flow data
 * @param setIsImportModalOpen Function to control the import modal visibility
 * @param messageApi Ant Design message API for notifications
 */
const processFileContent = (
  content: string,
  setImportedFlow: (flow: SavedFlow | null) => void,
  setIsImportModalOpen: (isOpen: boolean) => void,
  messageApi: MessageInstance,
): void => {
  try {
    const parsedFlow = validateFlowStructure(content);
    const validatedFlow = createValidatedFlow(parsedFlow);

    setImportedFlow(validatedFlow);
    setIsImportModalOpen(true);
  } catch (error) {
    messageApi.error({
      content: 'Invalid JSON file format.',
    });
    console.error('Import error:', error);
  }
};

/**
 * Creates upload props for the file import button
 * Configures file validation and processing
 * @param setImportedFlow Function to set the imported flow data
 * @param setIsImportModalOpen Function to control the import modal visibility
 * @returns UploadProps object for Ant Design Upload component
 */
export const createFileUploadProps = (
  setImportedFlow: (flow: SavedFlow | null) => void,
  setIsImportModalOpen: (isOpen: boolean) => void,
): UploadProps => {
  const messageApi = message.useMessage()[0];

  return {
    accept: '.json',
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processFileContent(
          content,
          setImportedFlow,
          setIsImportModalOpen,
          messageApi,
        );
      };
      reader.readAsText(file);
      return false;
    },
  };
};

/**
 * Filters flows based on a search query
 * @param flows Array of flows to filter
 * @param query Search query string
 * @returns Filtered array of flows that match the query
 */
export const filterFlows = (flows: SavedFlow[], query: string): SavedFlow[] => {
  return flows.filter((flow) =>
    flow.projectName.toLowerCase().includes(query.toLowerCase()),
  );
};

/**
 * Gets a flow name by its ID
 * @param flows Array of flows to search
 * @param flowId ID of the flow to find
 * @returns The name of the flow or "another flow" if not found
 */
export const getFlowNameById = (flows: SavedFlow[], flowId: string): string => {
  const flow = flows.find((f) => f.id === flowId);
  return flow ? flow.projectName : 'another flow';
};

/**
 * Creates a blob for exporting a flow
 * @param record Flow data to export
 * @returns Blob containing the flow data as JSON
 */
export const createExportBlob = (record: SavedFlow): Blob => {
  const flowData = JSON.stringify(record, null, 2);
  return new Blob([flowData], { type: 'application/json' });
};

/**
 * Generates a filename for exporting a flow
 * @param projectName Name of the project flow
 * @returns A filename with the project name and .json extension
 */
export const generateFileName = (projectName: string): string => {
  return `${projectName.replace(/\s+/g, '_')}_flow.json`;
};

/**
 * Downloads a file to the user's device
 * @param blob Blob containing the file data
 * @param fileName Name to use for the downloaded file
 */
export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports a flow to a JSON file
 * @param record Flow data to export
 * @param messageApi Ant Design message API for notifications
 */
export const exportFlow = (
  record: SavedFlow,
  messageApi: MessageInstance,
): void => {
  try {
    const blob = createExportBlob(record);
    const fileName = generateFileName(record.projectName);
    downloadFile(blob, fileName);

    messageApi.success({
      content: 'Flow exported successfully!',
    });
  } catch (error) {
    messageApi.error({
      content: 'Failed to export flow.',
    });
    console.error('Export error:', error);
  }
};

/**
 * Shows a success message to the user
 * @param messageApi Ant Design message API instance
 * @param content Message content to display
 */
export const showSuccessMessage = (
  messageApi: MessageInstance,
  content: string,
): void => {
  messageApi.success({ content });
};

/**
 * Shows an error message to the user
 * @param messageApi Ant Design message API instance
 * @param content Message content to display
 * @param error Optional error object to log to console
 */
export const showErrorMessage = (
  messageApi: MessageInstance,
  content: string,
  error?: unknown,
): void => {
  messageApi.error({ content });
  if (error) {
    console.error(content, error);
  }
};

/**
 * Shows an informational message to the user
 * @param messageApi Ant Design message API instance
 * @param content Message content to display
 */
export const showInfoMessage = (
  messageApi: MessageInstance,
  content: string,
): void => {
  messageApi.info({ content });
};
