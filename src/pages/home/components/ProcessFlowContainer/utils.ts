import type { Activity, SavedFlow } from '@/interfaces';
import type { UploadProps } from 'antd';
import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

const validateFlowStructure = (content: string): SavedFlow => {
  const parsedFlow = JSON.parse(content) as SavedFlow;

  if (!(parsedFlow.projectName && Array.isArray(parsedFlow.activities))) {
    throw new Error('Invalid flow format');
  }

  return parsedFlow;
};

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

export const filterFlows = (flows: SavedFlow[], query: string): SavedFlow[] => {
  return flows.filter((flow) =>
    flow.projectName.toLowerCase().includes(query.toLowerCase()),
  );
};

export const getFlowNameById = (flows: SavedFlow[], flowId: string): string => {
  const flow = flows.find((f) => f.id === flowId);
  return flow ? flow.projectName : 'another flow';
};

export const createExportBlob = (record: SavedFlow): Blob => {
  const flowData = JSON.stringify(record, null, 2);
  return new Blob([flowData], { type: 'application/json' });
};

export const generateFileName = (projectName: string): string => {
  return `${projectName.replace(/\s+/g, '_')}_flow.json`;
};

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

export const showSuccessMessage = (
  messageApi: MessageInstance,
  content: string,
): void => {
  messageApi.success({ content });
};

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

export const showInfoMessage = (
  messageApi: MessageInstance,
  content: string,
): void => {
  messageApi.info({ content });
};
