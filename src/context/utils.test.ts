import type { Activity, SavedFlow } from '@/interfaces';
import {
  addIdToActivity,
  applyActivityDefaults,
  areActivitiesDifferent,
  createFlowData,
  createNewFlow,
  filterFlowById,
  findFlowById,
  findFlowByName,
  getCurrentDateString,
  getNewFlowResult,
  getUnchangedFlowResult,
  getUpdatedFlowResult,
  isFlowInCollection,
  updateActivityInList,
  updateExistingFlow,
} from './utils';

// Mock crypto.randomUUID to return predictable values
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
const mockRandomUUID = jest.fn(() => mockUUID);

describe('Activity Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup crypto mock
    Object.defineProperty(global.crypto, 'randomUUID', {
      value: mockRandomUUID,
    });

    // Mock getCurrentDateString to return a consistent value for testing
    jest
      .spyOn(global.Date.prototype, 'toLocaleDateString')
      .mockReturnValue('3/17/2025');
  });

  describe('applyActivityDefaults', () => {
    it('returns activity with defaults for missing properties', () => {
      const minimalActivity: Activity = {
        id: 'test-id',
        activityName: 'Test Activity',
        color: '#FF0000',
      };

      const result = applyActivityDefaults(minimalActivity);

      expect(result).toEqual({
        id: 'test-id',
        activityName: 'Test Activity',
        description: '',
        inputs: [],
        outputs: [],
        color: '#FF0000',
        assignedUsers: [],
        position: undefined,
        deadline: undefined,
        approvalCriteria: '',
      });
    });

    it('generates ID if not provided', () => {
      const activityWithoutId = {
        activityName: 'No ID Activity',
        color: '#0000FF',
      } as Activity;

      const result = applyActivityDefaults(activityWithoutId);

      expect(result.id).toBe(mockUUID);
      expect(mockRandomUUID).toHaveBeenCalledTimes(1);
    });
  }); // Added closing bracket for applyActivityDefaults describe block

  describe('addIdToActivity', () => {
    it("adds ID to activity that doesn't have one", () => {
      const activityWithoutId = {
        activityName: 'No ID Activity',
        color: '#0000FF',
      } as Activity;

      const result = addIdToActivity(activityWithoutId);

      expect(result.id).toBe(mockUUID);
      expect(mockRandomUUID).toHaveBeenCalledTimes(1);
      expect(result.activityName).toBe(activityWithoutId.activityName);
      expect(result.color).toBe(activityWithoutId.color);
    });

    it('preserves existing ID', () => {
      const activityWithId: Activity = {
        id: 'existing-id',
        activityName: 'Has ID Activity',
        color: '#0000FF',
      };

      const result = addIdToActivity(activityWithId);

      expect(result.id).toBe('existing-id');
      expect(mockRandomUUID).not.toHaveBeenCalled();
    });
  });

  describe('updateActivityInList', () => {
    it('updates matching activity in the list', () => {
      const activities: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        { id: 'activity2', activityName: 'Activity 2', color: '#00FF00' },
        { id: 'activity3', activityName: 'Activity 3', color: '#0000FF' },
      ];

      const updatedActivity: Activity = {
        id: 'activity2',
        activityName: 'Updated Activity 2',
        color: '#FFFF00',
      };

      const result = updateActivityInList(activities, updatedActivity);

      expect(result).toHaveLength(3);
      expect(result[1]).toEqual(updatedActivity);
      expect(result[0]).toEqual(activities[0]);
      expect(result[2]).toEqual(activities[2]);
    });

    it('returns same list if no activity matches', () => {
      const activities: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        { id: 'activity2', activityName: 'Activity 2', color: '#00FF00' },
      ];

      const nonMatchingActivity: Activity = {
        id: 'activity3',
        activityName: 'Activity 3',
        color: '#0000FF',
      };

      const result = updateActivityInList(activities, nonMatchingActivity);

      expect(result).toHaveLength(2);
      expect(result).toEqual(activities);
      expect(result !== activities).toBe(true); // Check it's a new array
    });
  });

  describe('createNewFlow', () => {
    it('creates a new flow with ID and timestamps', () => {
      const flowData: Partial<SavedFlow> = {
        projectName: 'Test Project',
        activities: [
          { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        ],
      };

      const creationDate = '3/17/2025';
      const result = createNewFlow(flowData, creationDate);

      expect(result.id).toBe(mockUUID);
      expect(result.projectName).toBe('Test Project');
      expect(result.activities).toEqual(flowData.activities);
      expect(result.createdAt).toBe(creationDate);
      expect(result.lastModified).toBe(creationDate);
    });
  });

  describe('getCurrentDateString', () => {
    it('returns localized date string', () => {
      const result = getCurrentDateString();
      expect(result).toBe('3/17/2025');
    });
  });

  describe('areActivitiesDifferent', () => {
    it('returns true when activities are different', () => {
      const original: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        { id: 'activity2', activityName: 'Activity 2', color: '#00FF00' },
      ];

      const current: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        {
          id: 'activity2',
          activityName: 'Updated Activity 2',
          color: '#00FF00',
        },
      ];

      const result = areActivitiesDifferent(current, original);
      expect(result).toBe(true);
    });

    it('returns false when activities are the same', () => {
      const original: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        { id: 'activity2', activityName: 'Activity 2', color: '#00FF00' },
      ];

      const current = [...original]; // Create a new array with the same contents

      const result = areActivitiesDifferent(current, original);
      expect(result).toBe(false);
    });

    it('returns true when order is different', () => {
      const original: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        { id: 'activity2', activityName: 'Activity 2', color: '#00FF00' },
      ];

      const current: Activity[] = [
        { id: 'activity2', activityName: 'Activity 2', color: '#00FF00' },
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
      ];

      const result = areActivitiesDifferent(current, original);
      expect(result).toBe(true);
    });
  });

  describe('updateExistingFlow', () => {
    it('updates flow while preserving ID and createdAt date', () => {
      const existingFlow: SavedFlow = {
        id: 'flow-id',
        projectName: 'Original Project',
        activities: [
          { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
        ],
        createdAt: '3/15/2025',
        lastModified: '3/15/2025',
      };

      const flowData: Partial<SavedFlow> = {
        projectName: 'Updated Project',
        activities: [
          {
            id: 'activity1',
            activityName: 'Updated Activity 1',
            color: '#FF0000',
          },
          { id: 'activity2', activityName: 'New Activity', color: '#00FF00' },
        ],
        lastModified: '3/17/2025',
      };

      const result = updateExistingFlow(existingFlow, flowData, 'flow-id');

      expect(result.id).toBe('flow-id');
      expect(result.projectName).toBe('Updated Project');
      expect(result.activities).toEqual(flowData.activities);
      expect(result.createdAt).toBe('3/15/2025');
      expect(result.lastModified).toBe('3/17/2025');
    });
  });

  describe('findFlowById', () => {
    const flows: SavedFlow[] = [
      {
        id: 'flow1',
        projectName: 'Project 1',
        activities: [],
        createdAt: '3/15/2025',
        lastModified: '3/15/2025',
      },
      {
        id: 'flow2',
        projectName: 'Project 2',
        activities: [],
        createdAt: '3/16/2025',
        lastModified: '3/16/2025',
      },
    ];

    it('returns matching flow when found', () => {
      const result = findFlowById(flows, 'flow2');
      expect(result).toEqual(flows[1]);
    });

    it('returns undefined when flow is not found', () => {
      const result = findFlowById(flows, 'nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('findFlowByName', () => {
    const flows: SavedFlow[] = [
      {
        id: 'flow1',
        projectName: 'Project 1',
        activities: [],
        createdAt: '3/15/2025',
        lastModified: '3/15/2025',
      },
      {
        id: 'flow2',
        projectName: 'Project 2',
        activities: [],
        createdAt: '3/16/2025',
        lastModified: '3/16/2025',
      },
    ];

    it('returns matching flow when found', () => {
      const result = findFlowByName(flows, 'Project 1');
      expect(result).toEqual(flows[0]);
    });

    it('returns undefined when flow is not found', () => {
      const result = findFlowByName(flows, 'Nonexistent Project');
      expect(result).toBeUndefined();
    });
  });

  describe('createFlowData', () => {
    it('creates flow data object with current date', () => {
      const activities: Activity[] = [
        { id: 'activity1', activityName: 'Activity 1', color: '#FF0000' },
      ];

      const result = createFlowData('Test Project', activities);

      expect(result.projectName).toBe('Test Project');
      expect(result.activities).toEqual(activities);
      expect(result.lastModified).toBe('3/17/2025');
    });
  });

  describe('isFlowInCollection', () => {
    const flows: SavedFlow[] = [
      {
        id: 'flow1',
        projectName: 'Project 1',
        activities: [],
        createdAt: '3/15/2025',
        lastModified: '3/15/2025',
      },
      {
        id: 'flow2',
        projectName: 'Project 2',
        activities: [],
        createdAt: '3/16/2025',
        lastModified: '3/16/2025',
      },
    ];

    it('returns true when flow exists in collection', () => {
      const result = isFlowInCollection(flows, 'flow1');
      expect(result).toBe(true);
    });

    it('returns false when flow does not exist in collection', () => {
      const result = isFlowInCollection(flows, 'nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('filterFlowById', () => {
    const flows: SavedFlow[] = [
      {
        id: 'flow1',
        projectName: 'Project 1',
        activities: [],
        createdAt: '3/15/2025',
        lastModified: '3/15/2025',
      },
      {
        id: 'flow2',
        projectName: 'Project 2',
        activities: [],
        createdAt: '3/16/2025',
        lastModified: '3/16/2025',
      },
      {
        id: 'flow3',
        projectName: 'Project 3',
        activities: [],
        createdAt: '3/17/2025',
        lastModified: '3/17/2025',
      },
    ];

    it('filters out the specified flow', () => {
      const result = filterFlowById(flows, 'flow2');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('flow1');
      expect(result[1].id).toBe('flow3');
    });

    it('returns original array if flow not found', () => {
      const result = filterFlowById(flows, 'nonexistent');

      expect(result).toHaveLength(3);
      expect(result).toEqual(flows);
      expect(result !== flows).toBe(true); // Check it's a new array
    });
  });

  describe('result helper functions', () => {
    it('getNewFlowResult returns correct values', () => {
      const result = getNewFlowResult();
      expect(result.isNew).toBe(true);
      expect(result.isUpdated).toBe(false);
    });

    it('getUpdatedFlowResult returns correct values', () => {
      const result = getUpdatedFlowResult();
      expect(result.isNew).toBe(false);
      expect(result.isUpdated).toBe(true);
    });

    it('getUnchangedFlowResult returns correct values', () => {
      const result = getUnchangedFlowResult();
      expect(result.isNew).toBe(false);
      expect(result.isUpdated).toBe(false);
    });
  });
});
