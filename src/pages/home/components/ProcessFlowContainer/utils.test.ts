import type { SavedFlow } from '@/interfaces';
import type { MessageInstance } from 'antd/es/message/interface';
import type { RcFile } from 'antd/es/upload';
import {
  createFileUploadProps,
  filterFlows,
  generateFileName,
  getFlowNameById,
  showErrorMessage,
  showInfoMessage,
  showSuccessMessage,
} from './utils';

// Mock implementation-specific modules and functions
jest.mock('antd', () => ({
  message: {
    useMessage: jest.fn(() => [
      {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      },
    ]),
  },
}));

// Mock crypto.randomUUID
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
const mockRandomUUID = jest.fn(() => mockUUID);

// Create mock URL and Blob functions before any tests run
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

// Create an RcFile factory to properly create mock files for testing
const createMockRcFile = (content: string, filename: string): RcFile => {
  // Create a blob with the content
  // Create a mock file directly - bypassing the Blob/File constructors
  const rcFile = {
    uid: '1',
    name: filename,
    size: content.length,
    type: 'application/json',
    lastModified: Date.now(),
    lastModifiedDate: new Date(),
    slice: jest.fn(),
    arrayBuffer: () =>
      Promise.resolve(new TextEncoder().encode(content).buffer),
    stream: jest.fn(),
    text: () => Promise.resolve(content),
  } as unknown as RcFile;

  return rcFile;
};

describe('flowUtils', () => {
  // Setup before tests
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    Object.defineProperty(global.crypto, 'randomUUID', {
      value: mockRandomUUID,
    });

    // Reset the Blob mock
    jest.clearAllMocks();

    // Mock document functions
    document.createElement = jest.fn(() => ({
      href: '',
      download: '',
      click: jest.fn(),
    })) as unknown as typeof document.createElement;
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    // Mock console.error to prevent actual console output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally left empty to prevent actual console output during tests
    });
  });

  describe('createFileUploadProps', () => {
    it('returns upload props with correct configuration', () => {
      const setImportedFlow = jest.fn();
      const setIsImportModalOpen = jest.fn();

      const uploadProps = createFileUploadProps(
        setImportedFlow,
        setIsImportModalOpen,
      );

      expect(uploadProps.accept).toBe('.json');
      expect(uploadProps.showUploadList).toBe(false);
      expect(typeof uploadProps.beforeUpload).toBe('function');
    });

    it('beforeUpload reads file content and returns false to prevent automatic upload', () => {
      const setImportedFlow = jest.fn();
      const setIsImportModalOpen = jest.fn();

      const uploadProps = createFileUploadProps(
        setImportedFlow,
        setIsImportModalOpen,
      );

      const mockFile = createMockRcFile('{}', 'test.json');

      // Create a properly typed mock FileReader
      const mockFileReader = {
        onload: null,
        readAsText: jest.fn(),
        EMPTY: 0,
        LOADING: 1,
        DONE: 2,
      } as unknown as FileReader;

      // Simulate readAsText behavior
      (mockFileReader.readAsText as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            const event = {
              target: {
                result: '{"projectName":"Test Project","activities":[]}',
              },
            } as unknown as ProgressEvent<FileReader>;
            mockFileReader.onload(event);
          }
        }, 0);
      });

      // Mock FileReader constructor
      global.FileReader = jest.fn(
        () => mockFileReader,
      ) as unknown as typeof FileReader;

      // Handle the case where beforeUpload might be undefined
      if (uploadProps.beforeUpload) {
        // Call with the correct parameters (file and fileList)
        const fileList = [mockFile];
        const result = uploadProps.beforeUpload(mockFile, fileList);

        expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
        expect(result).toBe(false); // Should return false to prevent automatic upload
      } else {
        fail('beforeUpload should be defined');
      }
    });
  });

  describe('filterFlows', () => {
    const mockFlows: SavedFlow[] = [
      {
        id: '1',
        projectName: 'Alpha Project',
        activities: [],
        createdAt: '2023-01-01',
        lastModified: '2023-01-01',
      },
      {
        id: '2',
        projectName: 'Beta Testing',
        activities: [],
        createdAt: '2023-01-02',
        lastModified: '2023-01-02',
      },
      {
        id: '3',
        projectName: 'Gamma Release',
        activities: [],
        createdAt: '2023-01-03',
        lastModified: '2023-01-03',
      },
    ];

    it('filters flows based on query (case insensitive)', () => {
      const result1 = filterFlows(mockFlows, 'alpha');
      expect(result1).toHaveLength(1);
      expect(result1[0].id).toBe('1');

      const result2 = filterFlows(mockFlows, 'BETA');
      expect(result2).toHaveLength(1);
      expect(result2[0].id).toBe('2');
    });

    it('returns all flows when query is empty', () => {
      const result = filterFlows(mockFlows, '');
      expect(result).toHaveLength(3);
    });

    it('returns empty array when no matches found', () => {
      const result = filterFlows(mockFlows, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('handles partial matches', () => {
      // Using 'alp' to match only Alpha, not Beta or Gamma
      const result = filterFlows(mockFlows, 'alp');
      expect(result).toHaveLength(1);
      expect(result.map((flow) => flow.id)).toEqual(['1']);
    });
  });

  describe('getFlowNameById', () => {
    const mockFlows: SavedFlow[] = [
      {
        id: '1',
        projectName: 'Alpha Project',
        activities: [],
        createdAt: '2023-01-01',
        lastModified: '2023-01-01',
      },
      {
        id: '2',
        projectName: 'Beta Testing',
        activities: [],
        createdAt: '2023-01-02',
        lastModified: '2023-01-02',
      },
    ];

    it('returns flow name when ID is found', () => {
      const result = getFlowNameById(mockFlows, '1');
      expect(result).toBe('Alpha Project');
    });

    it('returns "another flow" when ID is not found', () => {
      const result = getFlowNameById(mockFlows, 'nonexistent');
      expect(result).toBe('another flow');
    });
  });

  describe('generateFileName', () => {
    it('replaces spaces with underscores in project name', () => {
      const result = generateFileName('My Test Project');
      expect(result).toBe('My_Test_Project_flow.json');
    });

    it('handles names without spaces', () => {
      const result = generateFileName('TestProject');
      expect(result).toBe('TestProject_flow.json');
    });

    it('handles multiple consecutive spaces', () => {
      const result = generateFileName('Test  Multiple   Spaces');
      expect(result).toBe('Test_Multiple_Spaces_flow.json');
    });
  });

  describe('message helpers', () => {
    it('showSuccessMessage displays success message', () => {
      const mockMessageApi = {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      } as unknown as MessageInstance;

      showSuccessMessage(mockMessageApi, 'Success test');

      expect(mockMessageApi.success).toHaveBeenCalledWith({
        content: 'Success test',
      });
    });

    it('showErrorMessage displays error message', () => {
      const mockMessageApi = {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      } as unknown as MessageInstance;

      showErrorMessage(mockMessageApi, 'Error test');

      expect(mockMessageApi.error).toHaveBeenCalledWith({
        content: 'Error test',
      });
    });

    it('showErrorMessage logs to console when error is provided', () => {
      const mockMessageApi = {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      } as unknown as MessageInstance;

      const mockError = new Error('Test error');
      console.error = jest.fn();

      showErrorMessage(mockMessageApi, 'Error test', mockError);

      expect(mockMessageApi.error).toHaveBeenCalledWith({
        content: 'Error test',
      });
      expect(console.error).toHaveBeenCalledWith('Error test', mockError);
    });

    it('showInfoMessage displays info message', () => {
      const mockMessageApi = {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      } as unknown as MessageInstance;

      showInfoMessage(mockMessageApi, 'Info test');

      expect(mockMessageApi.info).toHaveBeenCalledWith({
        content: 'Info test',
      });
    });
  });
});
